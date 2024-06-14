import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Keyboard from "./components/keyboard";
import { KeyType, KeyboardType } from "./components/keyTypes";

function App() {
  const [currentInput, setCurrentInput] = useState("");

  async function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentInput(e.target.value);
    await invoke("current_input", { ci: e.target.value }); // eventually will run the AI model
  }
  console.log(currentInput);
  const keyVal: KeyType[] = [{ key: "a", secondary: "A", tertiary: " " }, { key: "b", secondary: "B", tertiary: " " }]
  const keysArr: KeyboardType = { keys: keyVal }
  return (
    <div className="container">
      <input type="text" onInput={onInput} />
      {/* @ts-ignore */}
      <Keyboard keyboard={keysArr} />
    </div>
  );
};

export default App;
