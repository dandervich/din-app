import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [currentInput, setCurrentInput] = useState("");

  async function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentInput(e.target.value);
    await invoke("current_input", { ci: e.target.value }); // eventually will run the AI model
  }
  console.log(currentInput);
  return (
    <div className="container">
      <input type="text" onInput={onInput} />
    </div>
  );
}

export default App;
