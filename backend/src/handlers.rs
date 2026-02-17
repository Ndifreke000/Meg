use actix_web::{get, post, put, web, HttpResponse, Responder, HttpRequest, HttpMessage};
use sqlx::SqlitePool;
use uuid::Uuid;
use bcrypt::{hash, verify, DEFAULT_COST};
use validator::Validate;
use crate::models::*;
use crate::ai;
use crate::auth::{create_jwt, Claims};
use crate::medgemma;

#[get("/health")]
pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "health-ai-backend"
    }))
}

// Authentication endpoints
#[post("/auth/register")]
pub async fn register(
    pool: web::Data<SqlitePool>,
    user_data: web::Json<RegisterUser>,
) -> impl Responder {
    if let Err(e) = user_data.validate() {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "error": format!("Validation error: {}", e)
        }));
    }

    let id = Uuid::new_v4();
    let password_hash = match hash(&user_data.password, DEFAULT_COST) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to hash password"
        })),
    };

    let result = sqlx::query_as::<_, User>(
        "INSERT INTO users (id, email, password_hash, role, full_name, phone_number, country, state, location, ethnicity, job, identification_type, identification_number) 
         VALUES ($1, $2, $3, 'parent', $4, $5, $6, $7, $8, $9, $10, $11, $12) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(&user_data.email)
    .bind(&password_hash)
    .bind(&user_data.full_name)
    .bind(&user_data.phone_number)
    .bind(&user_data.country)
    .bind(&user_data.state)
    .bind(&user_data.location)
    .bind(&user_data.ethnicity)
    .bind(&user_data.job)
    .bind(&user_data.identification_type)
    .bind(&user_data.identification_number)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => {
            let user_id = Uuid::parse_str(&user.id).unwrap();
            let token = match create_jwt(user_id, user.email.clone(), user.role.clone()) {
                Ok(t) => t,
                Err(_) => return HttpResponse::InternalServerError().json(serde_json::json!({
                    "error": "Failed to create token"
                })),
            };

            HttpResponse::Created().json(AuthResponse {
                token,
                user: UserResponse {
                    id: user_id,
                    email: user.email,
                    role: user.role,
                    full_name: user.full_name,
                    phone_number: user.phone_number,
                    country: user.country,
                    profile_picture_url: user.profile_picture_url,
                },
            })
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create user: {}", e)
        }))
    }
}

#[post("/auth/login")]
pub async fn login(
    pool: web::Data<SqlitePool>,
    credentials: web::Json<LoginUser>,
) -> impl Responder {
    let result = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE email = $1"
    )
    .bind(&credentials.email)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => {
            match verify(&credentials.password, &user.password_hash) {
                Ok(true) => {
                    let user_id = Uuid::parse_str(&user.id).unwrap();
                    let token = match create_jwt(user_id, user.email.clone(), user.role.clone()) {
                        Ok(t) => t,
                        Err(_) => return HttpResponse::InternalServerError().json(serde_json::json!({
                            "error": "Failed to create token"
                        })),
                    };

                    HttpResponse::Ok().json(AuthResponse {
                        token,
                        user: UserResponse {
                            id: user_id,
                            email: user.email,
                            role: user.role,
                            full_name: user.full_name,
                            phone_number: user.phone_number,
                            country: user.country,
                            profile_picture_url: user.profile_picture_url,
                        },
                    })
                }
                _ => HttpResponse::Unauthorized().json(serde_json::json!({
                    "error": "Invalid credentials"
                }))
            }
        }
        Err(_) => HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid credentials"
        }))
    }
}

// Get current user
#[get("/auth/me")]
pub async fn get_current_user(
    pool: web::Data<SqlitePool>,
    req: HttpRequest,
) -> impl Responder {
    let extensions = req.extensions();
    let claims = match extensions.get::<Claims>() {
        Some(c) => c.clone(),
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Unauthorized"
        })),
    };

    let user_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Invalid user ID"
        })),
    };

    let result = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE id = $1"
    )
    .bind(user_id.to_string())
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => {
            let user_id = Uuid::parse_str(&user.id).unwrap();
            HttpResponse::Ok().json(UserResponse {
                id: user_id,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
                phone_number: user.phone_number,
                country: user.country,
                profile_picture_url: user.profile_picture_url,
            })
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch user: {}", e)
        }))
    }
}

// Child Profile endpoints
#[post("/children")]
pub async fn create_child_profile(
    pool: web::Data<SqlitePool>,
    req: HttpRequest,
    child_data: web::Json<CreateChildProfile>,
) -> impl Responder {
    let extensions = req.extensions();
    let claims = match extensions.get::<Claims>() {
        Some(c) => c.clone(),
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Unauthorized"
        })),
    };

    let parent_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Invalid user ID"
        })),
    };

    let id = Uuid::new_v4();
    let dob = child_data.date_of_birth.as_ref().and_then(|d| chrono::DateTime::parse_from_rfc3339(d).ok().map(|dt| dt.with_timezone(&chrono::Utc)));

    let result = sqlx::query_as::<_, ChildProfile>(
        "INSERT INTO child_profiles (id, parent_id, name, date_of_birth, age, gender, special_needs, diagnosis, medications, allergies, school_name, grade_level, emergency_contact_name, emergency_contact_phone, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(parent_id.to_string())
    .bind(&child_data.name)
    .bind(dob.map(|d| d.to_rfc3339()))
    .bind(child_data.age)
    .bind(&child_data.gender)
    .bind(child_data.special_needs.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(child_data.diagnosis.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(child_data.medications.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(child_data.allergies.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(&child_data.school_name)
    .bind(&child_data.grade_level)
    .bind(&child_data.emergency_contact_name)
    .bind(&child_data.emergency_contact_phone)
    .bind(&child_data.notes)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(child) => HttpResponse::Created().json(child),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create child profile: {}", e)
        }))
    }
}

#[get("/children")]
pub async fn get_children(
    pool: web::Data<SqlitePool>,
    req: HttpRequest,
) -> impl Responder {
    let extensions = req.extensions();
    let claims = match extensions.get::<Claims>() {
        Some(c) => c.clone(),
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Unauthorized"
        })),
    };

    let parent_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Invalid user ID"
        })),
    };

    let result = sqlx::query_as::<_, ChildProfile>(
        "SELECT * FROM child_profiles WHERE parent_id = $1 ORDER BY created_at DESC"
    )
    .bind(parent_id.to_string())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(children) => HttpResponse::Ok().json(children),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch children: {}", e)
        }))
    }
}

// Guardian endpoints
#[post("/guardians")]
pub async fn create_guardian(
    pool: web::Data<SqlitePool>,
    req: HttpRequest,
    guardian_data: web::Json<CreateGuardian>,
) -> impl Responder {
    let extensions = req.extensions();
    let claims = match extensions.get::<Claims>() {
        Some(c) => c.clone(),
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Unauthorized"
        })),
    };

    let user_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Invalid user ID"
        })),
    };

    let id = Uuid::new_v4();

    let result = sqlx::query_as::<_, Guardian>(
        "INSERT INTO guardians (id, child_id, added_by_user_id, name, relationship, email, phone_number, can_pickup, emergency_contact, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(guardian_data.child_id.to_string())
    .bind(user_id.to_string())
    .bind(&guardian_data.name)
    .bind(&guardian_data.relationship)
    .bind(&guardian_data.email)
    .bind(&guardian_data.phone_number)
    .bind(guardian_data.can_pickup as i32)
    .bind(guardian_data.emergency_contact as i32)
    .bind(&guardian_data.notes)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(guardian) => HttpResponse::Created().json(guardian),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create guardian: {}", e)
        }))
    }
}

#[get("/guardians/{child_id}")]
pub async fn get_guardians(
    pool: web::Data<SqlitePool>,
    child_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Guardian>(
        "SELECT * FROM guardians WHERE child_id = $1 ORDER BY created_at DESC"
    )
    .bind(child_id.to_string())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(guardians) => HttpResponse::Ok().json(guardians),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch guardians: {}", e)
        }))
    }
}

#[post("/mood")]
pub async fn log_mood(
    pool: web::Data<SqlitePool>,
    mood: web::Json<CreateMoodLog>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, MoodLog>(
        "INSERT INTO mood_logs (id, child_id, mood, energy_level, notes) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(mood.child_id.to_string())
    .bind(&mood.mood)
    .bind(mood.energy_level)
    .bind(&mood.notes)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(mood_log) => HttpResponse::Created().json(mood_log),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to log mood: {}", e)
        }))
    }
}

#[get("/mood/{child_id}")]
pub async fn get_mood_history(
    pool: web::Data<SqlitePool>,
    child_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, MoodLog>(
        "SELECT * FROM mood_logs WHERE child_id = $1 ORDER BY logged_at DESC LIMIT 30"
    )
    .bind(child_id.to_string())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(moods) => HttpResponse::Ok().json(moods),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch mood history: {}", e)
        }))
    }
}

#[post("/routines")]
pub async fn create_routine(
    pool: web::Data<SqlitePool>,
    routine: web::Json<CreateRoutine>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, Routine>(
        "INSERT INTO routines (id, child_id, title, description, scheduled_time, duration_minutes, icon) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(routine.child_id.to_string())
    .bind(&routine.title)
    .bind(&routine.description)
    .bind(&routine.scheduled_time)
    .bind(routine.duration_minutes)
    .bind(&routine.icon)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(routine) => HttpResponse::Created().json(routine),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create routine: {}", e)
        }))
    }
}

#[get("/routines/{child_id}")]
pub async fn get_routines(
    pool: web::Data<SqlitePool>,
    child_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Routine>(
        "SELECT * FROM routines WHERE child_id = $1 ORDER BY scheduled_time"
    )
    .bind(child_id.to_string())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(routines) => HttpResponse::Ok().json(routines),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch routines: {}", e)
        }))
    }
}

#[put("/routines/{id}/status")]
pub async fn update_routine_status(
    pool: web::Data<SqlitePool>,
    id: web::Path<Uuid>,
    status: web::Json<UpdateRoutineStatus>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Routine>(
        "UPDATE routines SET completed = $1 WHERE id = $2 RETURNING *"
    )
    .bind(status.completed as i32)
    .bind(id.to_string())
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(routine) => HttpResponse::Ok().json(routine),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to update routine: {}", e)
        }))
    }
}

#[post("/activities")]
pub async fn log_activity(
    pool: web::Data<SqlitePool>,
    activity: web::Json<CreateActivity>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, Activity>(
        "INSERT INTO activities (id, child_id, activity_type, title, focus_score, duration_minutes, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(activity.child_id.to_string())
    .bind(&activity.activity_type)
    .bind(&activity.title)
    .bind(activity.focus_score)
    .bind(activity.duration_minutes)
    .bind(&activity.notes)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(activity) => HttpResponse::Created().json(activity),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to log activity: {}", e)
        }))
    }
}

#[get("/activities/{child_id}")]
pub async fn get_activities(
    pool: web::Data<SqlitePool>,
    child_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Activity>(
        "SELECT * FROM activities WHERE child_id = $1 ORDER BY logged_at DESC LIMIT 50"
    )
    .bind(child_id.to_string())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(activities) => HttpResponse::Ok().json(activities),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch activities: {}", e)
        }))
    }
}

#[post("/meal-plans")]
pub async fn create_meal_plan(
    pool: web::Data<SqlitePool>,
    meal: web::Json<CreateMealPlan>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, MealPlan>(
        "INSERT INTO meal_plans (id, child_id, meal_type, scheduled_time, items, calories, dietary_notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(meal.child_id.to_string())
    .bind(&meal.meal_type)
    .bind(&meal.scheduled_time)
    .bind(serde_json::to_string(&meal.items).unwrap_or_default())
    .bind(meal.calories)
    .bind(&meal.dietary_notes)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(meal_plan) => HttpResponse::Created().json(meal_plan),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create meal plan: {}", e)
        }))
    }
}

#[get("/meal-plans/{child_id}")]
pub async fn get_meal_plans(
    pool: web::Data<SqlitePool>,
    child_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, MealPlan>(
        "SELECT * FROM meal_plans WHERE child_id = $1 ORDER BY scheduled_time"
    )
    .bind(child_id.to_string())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(meal_plans) => HttpResponse::Ok().json(meal_plans),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch meal plans: {}", e)
        }))
    }
}

#[get("/ai/insights/{child_id}")]
pub async fn get_ai_insights(
    pool: web::Data<SqlitePool>,
    child_id: web::Path<Uuid>,
) -> impl Responder {
    let insights = ai::generate_insights(pool.get_ref(), *child_id).await;
    
    match insights {
        Ok(insights) => HttpResponse::Ok().json(insights),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to generate insights: {}", e)
        }))
    }
}

#[get("/analytics/{child_id}")]
pub async fn get_analytics(
    pool: web::Data<SqlitePool>,
    child_id: web::Path<Uuid>,
) -> impl Responder {
    let analytics = ai::generate_analytics(pool.get_ref(), *child_id).await;
    
    match analytics {
        Ok(analytics) => HttpResponse::Ok().json(analytics),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to generate analytics: {}", e)
        }))
    }
}

// AI Chat endpoint
#[post("/ai/chat")]
pub async fn chat_with_ai(
    chat_message: web::Json<ChatMessage>,
) -> impl Responder {
    match medgemma::query_medgemma(chat_message.message.clone()).await {
        Ok(response) => HttpResponse::Ok().json(serde_json::json!({
            "response": response
        })),
        Err(e) => {
            log::error!("MedGemma API error: {}", e);
            // Fallback response
            HttpResponse::Ok().json(serde_json::json!({
                "response": "I'm here to help! Can you tell me more about what you're feeling or what you'd like to talk about?"
            }))
        }
    }
}

// Profile aliases for frontend compatibility
#[post("/profiles")]
pub async fn create_profile(
    pool: web::Data<SqlitePool>,
    req: HttpRequest,
    child_data: web::Json<CreateChildProfile>,
) -> impl Responder {
    let extensions = req.extensions();
    let claims = match extensions.get::<Claims>() {
        Some(c) => c.clone(),
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Unauthorized"
        })),
    };

    let parent_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Invalid user ID"
        })),
    };

    let id = Uuid::new_v4();
    let dob = child_data.date_of_birth.as_ref().and_then(|d| chrono::DateTime::parse_from_rfc3339(d).ok().map(|dt| dt.with_timezone(&chrono::Utc)));

    let result = sqlx::query_as::<_, ChildProfile>(
        "INSERT INTO child_profiles (id, parent_id, name, date_of_birth, age, gender, special_needs, diagnosis, medications, allergies, school_name, grade_level, emergency_contact_name, emergency_contact_phone, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
         RETURNING *"
    )
    .bind(id.to_string())
    .bind(parent_id.to_string())
    .bind(&child_data.name)
    .bind(dob.map(|d| d.to_rfc3339()))
    .bind(child_data.age)
    .bind(&child_data.gender)
    .bind(child_data.special_needs.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(child_data.diagnosis.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(child_data.medications.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(child_data.allergies.as_ref().map(|v| serde_json::to_string(v).unwrap_or_default()))
    .bind(&child_data.school_name)
    .bind(&child_data.grade_level)
    .bind(&child_data.emergency_contact_name)
    .bind(&child_data.emergency_contact_phone)
    .bind(&child_data.notes)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(child) => HttpResponse::Created().json(child),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create child profile: {}", e)
        }))
    }
}

#[get("/profiles")]
pub async fn get_profiles(
    pool: web::Data<SqlitePool>,
    req: HttpRequest,
) -> impl Responder {
    let extensions = req.extensions();
    let claims = match extensions.get::<Claims>() {
        Some(c) => c.clone(),
        None => return HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Unauthorized"
        })),
    };

    let parent_id = match Uuid::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Invalid user ID"
        })),
    };

    let result = sqlx::query_as::<_, ChildProfile>(
        "SELECT * FROM child_profiles WHERE parent_id = $1 ORDER BY created_at DESC"
    )
    .bind(parent_id.to_string())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(children) => HttpResponse::Ok().json(children),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch children: {}", e)
        }))
    }
}
