mod models;
mod handlers;
mod db;
mod ai;
mod auth;
mod medgemma;

use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_web_httpauth::middleware::HttpAuthentication;
use actix_cors::Cors;
use sqlx::SqlitePool;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:health_ai.db".to_string());
    
    let pool = SqlitePool::connect(&database_url)
        .await
        .expect("Failed to connect to database");
    
    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    log::info!("Starting Health-AI Backend on 0.0.0.0:8080");

    HttpServer::new(move || {
        let cors = Cors::permissive();
        let auth_middleware = HttpAuthentication::bearer(auth::validator);
        
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(Logger::default())
            .wrap(cors)
            .service(
                web::scope("/api")
                    // Public routes
                    .service(handlers::health_check)
                    .service(handlers::register)
                    .service(handlers::login)
                    // Protected routes
                    .service(
                        web::scope("")
                            .wrap(auth_middleware)
                            .service(handlers::get_current_user)
                            .service(handlers::create_child_profile)
                            .service(handlers::get_children)
                            // Alias for frontend compatibility
                            .service(handlers::create_profile)
                            .service(handlers::get_profiles)
                            .service(handlers::create_guardian)
                            .service(handlers::get_guardians)
                            .service(handlers::log_mood)
                            .service(handlers::get_mood_history)
                            .service(handlers::create_routine)
                            .service(handlers::get_routines)
                            .service(handlers::update_routine_status)
                            .service(handlers::log_activity)
                            .service(handlers::get_activities)
                            .service(handlers::create_meal_plan)
                            .service(handlers::get_meal_plans)
                            .service(handlers::get_ai_insights)
                            .service(handlers::get_analytics)
                            .service(handlers::chat_with_ai)
                    )
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
