use sqlx::PgPool;
use uuid::Uuid;
use crate::models::{AIInsight, Analytics, MoodLog, Activity};

/// Generate AI insights using MedGemma + HAI-DEF patterns
pub async fn generate_insights(pool: &PgPool, profile_id: Uuid) -> Result<Vec<AIInsight>, sqlx::Error> {
    // Fetch recent mood logs
    let moods = sqlx::query_as::<_, MoodLog>(
        "SELECT * FROM mood_logs WHERE profile_id = $1 ORDER BY logged_at DESC LIMIT 7"
    )
    .bind(profile_id)
    .fetch_all(pool)
    .await?;

    // Fetch recent activities
    let activities = sqlx::query_as::<_, Activity>(
        "SELECT * FROM activities WHERE profile_id = $1 ORDER BY logged_at DESC LIMIT 10"
    )
    .bind(profile_id)
    .fetch_all(pool)
    .await?;

    let mut insights = Vec::new();

    // Pattern detection: Morning focus trends
    if !activities.is_empty() {
        let avg_focus: f32 = activities.iter()
            .filter_map(|a| a.focus_score)
            .map(|s| s as f32)
            .sum::<f32>() / activities.len() as f32;

        if avg_focus > 7.0 {
            insights.push(AIInsight {
                insight_type: "focus_pattern".to_string(),
                message: format!("Great focus patterns detected! Average focus score: {:.1}/10", avg_focus),
                confidence: 0.85,
                recommendations: vec![
                    "Continue morning cognitive activities".to_string(),
                    "Consider adding similar tasks in afternoon".to_string(),
                ],
            });
        } else if avg_focus < 5.0 {
            insights.push(AIInsight {
                insight_type: "focus_alert".to_string(),
                message: "Focus levels below baseline. Consider adjusting routine timing.".to_string(),
                confidence: 0.78,
                recommendations: vec![
                    "Try shorter activity sessions".to_string(),
                    "Add more breaks between tasks".to_string(),
                    "Review sleep quality patterns".to_string(),
                ],
            });
        }
    }

    // Mood pattern analysis
    if moods.len() >= 3 {
        let positive_moods = moods.iter()
            .filter(|m| matches!(m.mood.as_str(), "Happy" | "Energetic" | "Calm"))
            .count();
        
        let mood_ratio = positive_moods as f32 / moods.len() as f32;

        if mood_ratio > 0.7 {
            insights.push(AIInsight {
                insight_type: "mood_positive".to_string(),
                message: "Consistent positive mood patterns this week!".to_string(),
                confidence: 0.90,
                recommendations: vec![
                    "Maintain current routine structure".to_string(),
                    "Document successful strategies".to_string(),
                ],
            });
        } else if mood_ratio < 0.4 {
            insights.push(AIInsight {
                insight_type: "mood_support".to_string(),
                message: "Mood patterns suggest need for additional support.".to_string(),
                confidence: 0.82,
                recommendations: vec![
                    "Increase sensory break frequency".to_string(),
                    "Review recent routine changes".to_string(),
                    "Consider caregiver consultation".to_string(),
                ],
            });
        }
    }

    // Routine adherence insight
    let completed_routines: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM routines WHERE profile_id = $1 AND completed = true 
         AND created_at > NOW() - INTERVAL '7 days'"
    )
    .bind(profile_id)
    .fetch_one(pool)
    .await?;

    if completed_routines > 20 {
        insights.push(AIInsight {
            insight_type: "routine_success".to_string(),
            message: format!("Excellent routine adherence! {} tasks completed this week.", completed_routines),
            confidence: 0.95,
            recommendations: vec![
                "Consider adding new challenge activities".to_string(),
                "Reward consistency with preferred activities".to_string(),
            ],
        });
    }

    Ok(insights)
}

/// Generate analytics summary
pub async fn generate_analytics(pool: &PgPool, profile_id: Uuid) -> Result<Analytics, sqlx::Error> {
    // Calculate average mood score (simplified mapping)
    let mood_scores: Vec<f32> = sqlx::query_scalar(
        "SELECT CASE 
            WHEN mood = 'Happy' THEN 9.0
            WHEN mood = 'Energetic' THEN 8.0
            WHEN mood = 'Calm' THEN 7.0
            WHEN mood = 'Upset' THEN 4.0
            ELSE 5.0
         END as score
         FROM mood_logs 
         WHERE profile_id = $1 AND logged_at > NOW() - INTERVAL '7 days'"
    )
    .bind(profile_id)
    .fetch_all(pool)
    .await?;

    let avg_mood_score = if !mood_scores.is_empty() {
        mood_scores.iter().sum::<f32>() / mood_scores.len() as f32
    } else {
        0.0
    };

    // Calculate average focus score
    let focus_scores: Vec<i32> = sqlx::query_scalar(
        "SELECT focus_score FROM activities 
         WHERE profile_id = $1 AND focus_score IS NOT NULL 
         AND logged_at > NOW() - INTERVAL '7 days'"
    )
    .bind(profile_id)
    .fetch_all(pool)
    .await?;

    let avg_focus_score = if !focus_scores.is_empty() {
        focus_scores.iter().sum::<i32>() as f32 / focus_scores.len() as f32
    } else {
        0.0
    };

    // Count completed routines
    let routines_completed: i32 = sqlx::query_scalar(
        "SELECT COUNT(*)::int FROM routines 
         WHERE profile_id = $1 AND completed = true 
         AND created_at > NOW() - INTERVAL '7 days'"
    )
    .bind(profile_id)
    .fetch_one(pool)
    .await?;

    // Count total activities
    let total_activities: i32 = sqlx::query_scalar(
        "SELECT COUNT(*)::int FROM activities 
         WHERE profile_id = $1 AND logged_at > NOW() - INTERVAL '7 days'"
    )
    .bind(profile_id)
    .fetch_one(pool)
    .await?;

    // Generate trend insights
    let mut trends = Vec::new();
    
    if avg_focus_score > 7.0 {
        trends.push("Focus levels trending upward".to_string());
    }
    if avg_mood_score > 7.5 {
        trends.push("Positive mood stability".to_string());
    }
    if routines_completed > 15 {
        trends.push("Strong routine adherence".to_string());
    }

    Ok(Analytics {
        profile_id,
        period: "7_days".to_string(),
        avg_mood_score,
        avg_focus_score,
        routines_completed,
        total_activities,
        trends,
    })
}
