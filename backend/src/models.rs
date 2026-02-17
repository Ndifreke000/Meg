use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

// User/Parent Account
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: String,
    pub email: String,
    pub password_hash: String,
    pub role: String, // parent, guardian, admin
    pub full_name: String,
    pub phone_number: Option<String>,
    pub country: Option<String>,
    pub state: Option<String>,
    pub location: Option<String>,
    pub ethnicity: Option<String>,
    pub job: Option<String>,
    pub identification_type: Option<String>,
    pub identification_number: Option<String>,
    pub profile_picture_url: Option<String>,
    pub is_verified: i32,
    pub created_at: String,
}

impl User {
    #[allow(dead_code)]
    pub fn get_id(&self) -> Uuid {
        Uuid::parse_str(&self.id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn is_verified_bool(&self) -> bool {
        self.is_verified != 0
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct RegisterUser {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 8))]
    pub password: String,
    pub full_name: String,
    pub phone_number: Option<String>,
    pub country: Option<String>,
    pub state: Option<String>,
    pub location: Option<String>,
    pub ethnicity: Option<String>,
    pub job: Option<String>,
    pub identification_type: Option<String>,
    pub identification_number: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LoginUser {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub email: String,
    pub role: String,
    pub full_name: String,
    pub phone_number: Option<String>,
    pub country: Option<String>,
    pub profile_picture_url: Option<String>,
}

// Child Profile
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct ChildProfile {
    pub id: String,
    pub parent_id: String,
    pub name: String,
    pub date_of_birth: Option<String>,
    pub age: Option<i32>,
    pub gender: Option<String>,
    pub special_needs: Option<String>,
    pub diagnosis: Option<String>,
    pub medications: Option<String>,
    pub allergies: Option<String>,
    pub school_name: Option<String>,
    pub grade_level: Option<String>,
    pub emergency_contact_name: Option<String>,
    pub emergency_contact_phone: Option<String>,
    pub profile_picture_url: Option<String>,
    pub notes: Option<String>,
    pub created_at: String,
}

impl ChildProfile {
    #[allow(dead_code)]
    pub fn get_id(&self) -> Uuid {
        Uuid::parse_str(&self.id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn get_parent_id(&self) -> Uuid {
        Uuid::parse_str(&self.parent_id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn get_special_needs(&self) -> Option<Vec<String>> {
        self.special_needs.as_ref().and_then(|s| serde_json::from_str(s).ok())
    }
    
    #[allow(dead_code)]
    pub fn get_diagnosis(&self) -> Option<Vec<String>> {
        self.diagnosis.as_ref().and_then(|s| serde_json::from_str(s).ok())
    }
    
    #[allow(dead_code)]
    pub fn get_medications(&self) -> Option<Vec<String>> {
        self.medications.as_ref().and_then(|s| serde_json::from_str(s).ok())
    }
    
    #[allow(dead_code)]
    pub fn get_allergies(&self) -> Option<Vec<String>> {
        self.allergies.as_ref().and_then(|s| serde_json::from_str(s).ok())
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateChildProfile {
    pub name: String,
    pub date_of_birth: Option<String>,
    pub age: Option<i32>,
    pub gender: Option<String>,
    pub special_needs: Option<Vec<String>>,
    pub diagnosis: Option<Vec<String>>,
    pub medications: Option<Vec<String>>,
    pub allergies: Option<Vec<String>>,
    pub school_name: Option<String>,
    pub grade_level: Option<String>,
    pub emergency_contact_name: Option<String>,
    pub emergency_contact_phone: Option<String>,
    pub notes: Option<String>,
}

// Guardian/Contact
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Guardian {
    pub id: String,
    pub child_id: String,
    pub added_by_user_id: String,
    pub name: String,
    pub relationship: String,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub can_pickup: i32,
    pub emergency_contact: i32,
    pub notes: Option<String>,
    pub created_at: String,
}

impl Guardian {
    #[allow(dead_code)]
    pub fn get_id(&self) -> Uuid {
        Uuid::parse_str(&self.id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn can_pickup_bool(&self) -> bool {
        self.can_pickup != 0
    }
    
    #[allow(dead_code)]
    pub fn emergency_contact_bool(&self) -> bool {
        self.emergency_contact != 0
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateGuardian {
    pub child_id: Uuid,
    pub name: String,
    pub relationship: String,
    pub email: Option<String>,
    pub phone_number: Option<String>,
    pub can_pickup: bool,
    pub emergency_contact: bool,
    pub notes: Option<String>,
}

// Mood Log
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MoodLog {
    pub id: String,
    pub child_id: String,
    pub mood: String,
    pub energy_level: Option<i32>,
    pub notes: Option<String>,
    pub logged_at: String,
}

impl MoodLog {
    #[allow(dead_code)]
    pub fn get_id(&self) -> Uuid {
        Uuid::parse_str(&self.id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn get_child_id(&self) -> Uuid {
        Uuid::parse_str(&self.child_id).unwrap()
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateMoodLog {
    pub child_id: Uuid,
    pub mood: String,
    pub energy_level: Option<i32>,
    pub notes: Option<String>,
}

// Routine
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Routine {
    pub id: String,
    pub child_id: String,
    pub title: String,
    pub description: Option<String>,
    pub scheduled_time: String,
    pub duration_minutes: Option<i32>,
    pub icon: Option<String>,
    pub completed: i32,
    pub created_at: String,
}

impl Routine {
    #[allow(dead_code)]
    pub fn get_id(&self) -> Uuid {
        Uuid::parse_str(&self.id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn is_completed(&self) -> bool {
        self.completed != 0
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateRoutine {
    pub child_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub scheduled_time: String,
    pub duration_minutes: Option<i32>,
    pub icon: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateRoutineStatus {
    pub completed: bool,
}

// Activity
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Activity {
    pub id: String,
    pub child_id: String,
    pub activity_type: String,
    pub title: String,
    pub focus_score: Option<i32>,
    pub duration_minutes: Option<i32>,
    pub notes: Option<String>,
    pub logged_at: String,
}

impl Activity {
    #[allow(dead_code)]
    pub fn get_id(&self) -> Uuid {
        Uuid::parse_str(&self.id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn get_child_id(&self) -> Uuid {
        Uuid::parse_str(&self.child_id).unwrap()
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateActivity {
    pub child_id: Uuid,
    pub activity_type: String,
    pub title: String,
    pub focus_score: Option<i32>,
    pub duration_minutes: Option<i32>,
    pub notes: Option<String>,
}

// Meal Plan
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MealPlan {
    pub id: String,
    pub child_id: String,
    pub meal_type: String,
    pub scheduled_time: String,
    pub items: String,
    pub calories: Option<i32>,
    pub dietary_notes: Option<String>,
    pub created_at: String,
}

impl MealPlan {
    #[allow(dead_code)]
    pub fn get_id(&self) -> Uuid {
        Uuid::parse_str(&self.id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn get_child_id(&self) -> Uuid {
        Uuid::parse_str(&self.child_id).unwrap()
    }
    
    #[allow(dead_code)]
    pub fn get_items(&self) -> Vec<String> {
        serde_json::from_str(&self.items).unwrap_or_default()
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateMealPlan {
    pub child_id: Uuid,
    pub meal_type: String,
    pub scheduled_time: String,
    pub items: Vec<String>,
    pub calories: Option<i32>,
    pub dietary_notes: Option<String>,
}

// AI Insights
#[derive(Debug, Serialize)]
pub struct AIInsight {
    pub insight_type: String,
    pub message: String,
    pub confidence: f32,
    pub recommendations: Vec<String>,
}

// Analytics
#[derive(Debug, Serialize)]
pub struct Analytics {
    pub child_id: Uuid,
    pub period: String,
    pub avg_mood_score: f32,
    pub avg_focus_score: f32,
    pub routines_completed: i32,
    pub total_activities: i32,
    pub trends: Vec<String>,
}

// Chat Message
#[derive(Debug, Deserialize)]
pub struct ChatMessage {
    pub message: String,
    pub child_id: Option<Uuid>,
}
