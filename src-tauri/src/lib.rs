use serialport::{self, SerialPortInfo};

// https://github.com/PyO3/pyo3
// ^ investigate this option?

// use ubuntu 22.04.3 LTS DONT FORGET

// https://stackoverflow.com/questions/24214643/python-to-automatically-select-serial-ports-for-arduino
// ^ this will help us find the port with the keyboard dynamically... only problem could be if another device has the same name then we're fucked LOL

// opening and cofiguring a serial port
// let port = serialport::new("/dev/ttyUSB0", 115_200)
// .timeout(Duration::from_millis(10))
// .open().expect("Failed to open port");

// writing to a port
// let output = "This is a test. This is only a test.".as_bytes();
// port.write(output).expect("Write failed!");

// reading from a port
// let mut serial_buf: Vec<u8> = vec![0; 32];
// let n = port.read(serial_buf.as_mut_slice()).expect("Read failed!");

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(rename_all = "snake_case")]
fn current_input(ci: String) -> String {
    println!("the current input is: {}", ci);
    let ports: Vec<serialport::SerialPortInfo> =
        serialport::available_ports().expect("No ports found!");
    println!("ports: {}", ports.len());
    if ports.len() == 0 {
        return "NO PORTS".to_string();
    }
    for p in ports {
        println!("port: {}", p.port_name);
    }
    return "DONE".to_string();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, current_input])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
