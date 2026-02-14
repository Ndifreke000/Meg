mod models;
mod handlers;
mod db;
mod ai;

use actix_web::{web, App, HttpServer, middleware::Logger};
use actix_cors::Cors;
use sqlx::PgPool;
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres:postgres@localhost/health_ai".to_string());
    
    let pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    log::info!("Starting Health-AI Backend on 0.0.0.0:8080");

    HttpServer::new(move || {
        let cors = Cors::permissive();
        
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .wrap(Logger::default())
            .wrap(cors)
            .service(
                web::scope("/api")
                    .service(handlers::health_check)
                    .service(handlers::create_profile)
                    .service(handlers::get_profiles)
                    .service(handlers::log_mood)
                    .service(handlers::get_mood_history)
                    .service(handlers::create_routine)
                    .service(handlers::get_routines)
                    .service(handlers::update_routine_status)
                    .service(handlers::get_ai_insights)
                    .service(handlers::create_meal_plan)
                    .service(handlers::get_meal_plans)
                    .service(handlers::log_activity)
                    .service(handlers::get_activities)
                    .service(handlers::get_analytics)
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
