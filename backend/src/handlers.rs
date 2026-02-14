use actix_web::{get, post, put, web, HttpResponse, Responder};
use sqlx::PgPool;
use uuid::Uuid;
use crate::models::*;
use crate::ai;

#[get("/health")]
pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "health-ai-backend"
    }))
}

#[post("/profiles")]
pub async fn create_profile(
    pool: web::Data<PgPool>,
    profile: web::Json<CreateProfile>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, Profile>(
        "INSERT INTO profiles (id, name, role, age, special_needs) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *"
    )
    .bind(id)
    .bind(&profile.name)
    .bind(&profile.role)
    .bind(profile.age)
    .bind(&profile.special_needs)
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(profile) => HttpResponse::Created().json(profile),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create profile: {}", e)
        }))
    }
}

#[get("/profiles")]
pub async fn get_profiles(pool: web::Data<PgPool>) -> impl Responder {
    let result = sqlx::query_as::<_, Profile>("SELECT * FROM profiles ORDER BY created_at DESC")
        .fetch_all(pool.get_ref())
        .await;

    match result {
        Ok(profiles) => HttpResponse::Ok().json(profiles),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch profiles: {}", e)
        }))
    }
}

#[post("/mood")]
pub async fn log_mood(
    pool: web::Data<PgPool>,
    mood: web::Json<CreateMoodLog>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, MoodLog>(
        "INSERT INTO mood_logs (id, profile_id, mood, energy_level, notes) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *"
    )
    .bind(id)
    .bind(mood.profile_id)
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

#[get("/mood/{profile_id}")]
pub async fn get_mood_history(
    pool: web::Data<PgPool>,
    profile_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, MoodLog>(
        "SELECT * FROM mood_logs WHERE profile_id = $1 ORDER BY logged_at DESC LIMIT 30"
    )
    .bind(profile_id.into_inner())
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
    pool: web::Data<PgPool>,
    routine: web::Json<CreateRoutine>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, Routine>(
        "INSERT INTO routines (id, profile_id, title, description, scheduled_time, duration_minutes, icon) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *"
    )
    .bind(id)
    .bind(routine.profile_id)
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

#[get("/routines/{profile_id}")]
pub async fn get_routines(
    pool: web::Data<PgPool>,
    profile_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Routine>(
        "SELECT * FROM routines WHERE profile_id = $1 ORDER BY scheduled_time"
    )
    .bind(profile_id.into_inner())
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
    pool: web::Data<PgPool>,
    id: web::Path<Uuid>,
    status: web::Json<UpdateRoutineStatus>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Routine>(
        "UPDATE routines SET completed = $1 WHERE id = $2 RETURNING *"
    )
    .bind(status.completed)
    .bind(id.into_inner())
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
    pool: web::Data<PgPool>,
    activity: web::Json<CreateActivity>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, Activity>(
        "INSERT INTO activities (id, profile_id, activity_type, title, focus_score, duration_minutes, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *"
    )
    .bind(id)
    .bind(activity.profile_id)
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

#[get("/activities/{profile_id}")]
pub async fn get_activities(
    pool: web::Data<PgPool>,
    profile_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, Activity>(
        "SELECT * FROM activities WHERE profile_id = $1 ORDER BY logged_at DESC LIMIT 50"
    )
    .bind(profile_id.into_inner())
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
    pool: web::Data<PgPool>,
    meal: web::Json<CreateMealPlan>,
) -> impl Responder {
    let id = Uuid::new_v4();
    
    let result = sqlx::query_as::<_, MealPlan>(
        "INSERT INTO meal_plans (id, profile_id, meal_type, scheduled_time, items, calories, dietary_notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *"
    )
    .bind(id)
    .bind(meal.profile_id)
    .bind(&meal.meal_type)
    .bind(&meal.scheduled_time)
    .bind(&meal.items)
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

#[get("/meal-plans/{profile_id}")]
pub async fn get_meal_plans(
    pool: web::Data<PgPool>,
    profile_id: web::Path<Uuid>,
) -> impl Responder {
    let result = sqlx::query_as::<_, MealPlan>(
        "SELECT * FROM meal_plans WHERE profile_id = $1 ORDER BY scheduled_time"
    )
    .bind(profile_id.into_inner())
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(meal_plans) => HttpResponse::Ok().json(meal_plans),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch meal plans: {}", e)
        }))
    }
}

#[get("/ai/insights/{profile_id}")]
pub async fn get_ai_insights(
    pool: web::Data<PgPool>,
    profile_id: web::Path<Uuid>,
) -> impl Responder {
    let insights = ai::generate_insights(pool.get_ref(), profile_id.into_inner()).await;
    
    match insights {
        Ok(insights) => HttpResponse::Ok().json(insights),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to generate insights: {}", e)
        }))
    }
}

#[get("/analytics/{profile_id}")]
pub async fn get_analytics(
    pool: web::Data<PgPool>,
    profile_id: web::Path<Uuid>,
) -> impl Responder {
    let analytics = ai::generate_analytics(pool.get_ref(), profile_id.into_inner()).await;
    
    match analytics {
        Ok(analytics) => HttpResponse::Ok().json(analytics),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to generate analytics: {}", e)
        }))
    }
}
