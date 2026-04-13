#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri::api::process::{Command, CommandEvent};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 🚀 Automatic Sidecar Management
            // In a real production apps, we would start qg-api here as a sidecar
            // For now, we allow the UI to communicate with the bundled Go backend
            
            let window = app.get_window("main").unwrap();
            
            // Apply vibrancy/blur effects if on Windows
            #[cfg(target_os = "windows")]
            {
                use window_vibrancy::{apply_blur, apply_mica};
                // We'll add transparency support via tauri.conf.json
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
