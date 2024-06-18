import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Keyboard from "./components/keyboard";
import { KeyType, KeyboardType } from "./components/keyTypes";
import KeyJSON from "./assets/keys.json"
function App() {
  const [currentInput, setCurrentInput] = useState("");
  const [shiftClicked, setShiftClicked] = useState(false);
  async function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
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
  const keysArr: KeyboardType = KeyJSON;
  async function OnClickFunc(key: KeyType, secondary: boolean, tertiary: boolean) {
    let CK = key.key
    if (shiftClicked) {
      CK = CK.toString().toUpperCase()
    }
    if (key.key == "Backspace") {
      if (currentInput != null && currentInput.length > 0)
        setCurrentInput(currentInput.substring(0, currentInput.length - 1))
    } else if (key.key == "CapsLock") {
      setShiftClicked(!shiftClicked);
    }
    else if (secondary) setCurrentInput(currentInput + key.secondary)
    else if (tertiary) setCurrentInput(currentInput + key.tertiary)
    else
      setCurrentInput(currentInput + CK)
  }
  return (
    <div className="container">
      <textarea className="input" onChange={onChange} value={currentInput}> </textarea>
      <Keyboard OnClickFunc={OnClickFunc} keyboard={keysArr} secondary={false} />
    </div>
  );
};

export default App;
