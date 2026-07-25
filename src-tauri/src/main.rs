fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![close_application, toggle_devtools, log_from_js])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn close_application() {
    std::process::exit(0);
}

#[tauri::command]
fn toggle_devtools() {
    // This will be handled on the frontend side
}

#[tauri::command]
fn log_from_js(msg: String) {
    println!("[JS LOG] {}", msg);
}