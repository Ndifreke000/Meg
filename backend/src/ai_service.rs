use std::process::{Command, Stdio};
use std::thread;
use std::time::Duration;

pub fn start_ai_service() {
    thread::spawn(|| {
        // Check if Python AI service is available
        if check_python_available() {
            log::info!("Starting embedded AI service...");
            let mut child = Command::new("python3")
                .arg("../ai-service/medgemma_local.py")
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
                .expect("Failed to start AI service");
            
            // Keep the service running
            let _ = child.wait();
        } else {
            log::warn!("Python not available, AI will use fallback responses");
        }
    });
    
    // Give AI service time to start
    thread::sleep(Duration::from_secs(2));
}

fn check_python_available() -> bool {
    Command::new("python3")
        .arg("--version")
        .output()
        .is_ok()
}