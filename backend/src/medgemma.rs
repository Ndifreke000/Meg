use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;
use std::env;

#[derive(Debug, Serialize)]
pub struct MedGemmaRequest {
    pub inputs: String,
    pub parameters: MedGemmaParameters,
}

#[derive(Debug, Serialize)]
pub struct MedGemmaParameters {
    pub max_new_tokens: u32,
    pub temperature: f32,
    pub do_sample: bool,
}

#[derive(Debug, Deserialize)]
pub struct MedGemmaResponse {
    pub generated_text: String,
}

pub async fn query_medgemma(prompt: String) -> Result<String, Box<dyn std::error::Error>> {
    // Try local service first, fallback to Hugging Face API
    if let Ok(response) = query_local_service(&prompt).await {
        return Ok(response);
    }
    
    query_huggingface_api(prompt).await
}

async fn query_local_service(prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    
    let response = client
        .post("http://localhost:5000/chat")
        .json(&serde_json::json!({"message": prompt}))
        .send()
        .await?;

    if !response.status().is_success() {
        return Err("Local service unavailable".into());
    }

    let response_data: serde_json::Value = response.json().await?;
    Ok(response_data["response"].as_str().unwrap_or("No response").to_string())
}

async fn query_huggingface_api(prompt: String) -> Result<String, Box<dyn std::error::Error>> {
    let api_token = env::var("HUGGINGFACE_API_TOKEN")
        .unwrap_or_else(|_| "your-huggingface-token".to_string());
    
    let client = reqwest::Client::new();
    
    let request = MedGemmaRequest {
        inputs: format!("You are a helpful AI assistant for children with special needs. Please provide supportive, age-appropriate responses. Question: {}", prompt),
        parameters: MedGemmaParameters {
            max_new_tokens: 200,
            temperature: 0.7,
            do_sample: true,
        },
    };

    let response = client
        .post("https://api-inference.huggingface.co/models/google/medgemma-1.5-4b-it")
        .header("Authorization", format!("Bearer {}", api_token))
        .header("Content-Type", "application/json")
        .json(&request)
        .send()
        .await?;

    if !response.status().is_success() {
        let error_text = response.text().await?;
        return Err(format!("API request failed: {}", error_text).into());
    }

    let response_data: Vec<MedGemmaResponse> = response.json().await?;
    
    if let Some(first_response) = response_data.first() {
        // Clean up the response by removing the original prompt
        let generated_text = first_response.generated_text.clone();
        let cleaned_response = if let Some(index) = generated_text.find("Question:") {
            if let Some(answer_start) = generated_text[index..].find('\n') {
                generated_text[index + answer_start..].trim().to_string()
            } else {
                generated_text
            }
        } else {
            generated_text
        };
        
        Ok(cleaned_response)
    } else {
        Err("No response from MedGemma".into())
    }
}