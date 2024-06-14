import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Keyboard from "./components/keyboard";
import { KeyType, KeyboardType } from "./components/keyTypes";

function App() {
  const [currentInput, setCurrentInput] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentInput(e.target.value);
    // await invoke("current_input", { ci: e.target.value }); // eventually will run the AI model
  }
  useEffect(() => {
    let algo = async () => {
      let algis = await invoke("current_input", { ci: currentInput }); // eventually will run the AI model
      // if "NO PORTS" return error in connection to ai model
      // else return data model suggestions.
    }
    algo();
  }, [currentInput])
  console.log(currentInput);
  const keysArr: KeyboardType = { keys: [{ key: "a", secondary: "A", tertiary: " " }, { key: "b", secondary: "B", tertiary: " " }] }
  async function OnClickFunc(key: KeyType, secondary: boolean, tertiary: boolean) {
    if (secondary) setCurrentInput(currentInput + key.secondary)
    else if (tertiary) setCurrentInput(currentInput + key.tertiary)
    else
      setCurrentInput(currentInput + key.key)
  }
  return (
    <div className="container">
      <input type="text" onChange={onChange} value={currentInput} />
      <Keyboard OnClickFunc={OnClickFunc} keyboard={keysArr} />
    </div>
  );
};

export default App;
