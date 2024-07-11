use serialport::{self, SerialPortInfo};
use std::time::Duration;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;
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

// 192.168.0.39:65432
// #[tauri::command(rename_all = "snake_case")]
// fn current_input(ci: String) -> String {
//     println!("Received input: {}", ci);

//     // Retrieve available serial ports
//     let ports = serialport::available_ports().expect("Failed to enumerate serial ports!");
//     if ports.is_empty() {
//         return "NO PORTS".to_string();
//     }

//     // Iterate through available ports
//     for port in ports {
//         println!("HEY");
//         println!("Found port: {}", port.port_name);

//         // Example: Open and write to a specific port
//         match serialport::new(&port.port_name, 9600)
//             .timeout(Duration::from_millis(10))
//             .open()
//         {
//             Ok(mut port) => {
//                 println!("Opened port successfully: {}", "COM5");
//                 let message = "This is a test. This is only a test.".as_bytes();
//                 port.write(message).expect("Failed to write to port");
//                 let mut buf: &mut [u8] = todo!();
//                 port.read(buf);
//                 return "DONE".to_string(); // Exit after first successful write
//             }
//             Err(e) => eprintln!("Failed to open port {}: {}", port.port_name, e),
//         }
//     }

//     "NO PORT OPENED".to_string() // Return this if no ports were successfully opened
// }

// hostname -I
#[tauri::command]
async fn send_message(message: String) -> Result<String, String> {
    let addr = "192.168.0.39:65432"; // Replace with your Raspberry Pi's IP address
    let mut stream = TcpStream::connect(addr).await.map_err(|e| e.to_string())?;

    stream
        .write_all(message.as_bytes())
        .await
        .map_err(|e| e.to_string())?;
    let mut buffer = vec![0; 1024];
    let n = stream.read(&mut buffer).await.map_err(|e| e.to_string())?;
    Ok(String::from_utf8_lossy(&buffer[..n]).to_string())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, send_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
