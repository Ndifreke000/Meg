use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Profile {
    pub id: Uuid,
    pub name: String,
    pub role: String,
    pub age: Option<i32>,
    pub special_needs: Option<Vec<String>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateProfile {
    pub name: String,
    pub role: String,
    pub age: Option<i32>,
    pub special_needs: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MoodLog {
    pub id: Uuid,
    pub profile_id: Uuid,
    pub mood: String,
    pub energy_level: Option<i32>,
    pub notes: Option<String>,
    pub logged_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateMoodLog {
    pub profile_id: Uuid,
    pub mood: String,
    pub energy_level: Option<i32>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Routine {
    pub id: Uuid,
    pub profile_id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub scheduled_time: String,
    pub duration_minutes: Option<i32>,
    pub icon: Option<String>,
    pub completed: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateRoutine {
    pub profile_id: Uuid,
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

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Activity {
    pub id: Uuid,
    pub profile_id: Uuid,
    pub activity_type: String,
    pub title: String,
    pub focus_score: Option<i32>,
    pub duration_minutes: Option<i32>,
    pub notes: Option<String>,
    pub logged_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateActivity {
    pub profile_id: Uuid,
    pub activity_type: String,
    pub title: String,
    pub focus_score: Option<i32>,
    pub duration_minutes: Option<i32>,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MealPlan {
    pub id: Uuid,
    pub profile_id: Uuid,
    pub meal_type: String,
    pub scheduled_time: String,
    pub items: Vec<String>,
    pub calories: Option<i32>,
    pub dietary_notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateMealPlan {
    pub profile_id: Uuid,
    pub meal_type: String,
    pub scheduled_time: String,
    pub items: Vec<String>,
    pub calories: Option<i32>,
    pub dietary_notes: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct AIInsight {
    pub insight_type: String,
    pub message: String,
    pub confidence: f32,
    pub recommendations: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct Analytics {
    pub profile_id: Uuid,
    pub period: String,
    pub avg_mood_score: f32,
    pub avg_focus_score: f32,
    pub routines_completed: i32,
    pub total_activities: i32,
    pub trends: Vec<String>,
}
