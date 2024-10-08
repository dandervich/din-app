import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./App.css";
import dinLogo from "./assets/Mask group.svg"
function App() {
  // async function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  //   setCurrentInput(e.target.value);
  //   // await invoke("current_input", { ci: e.target.value }); // eventually will run the AI model
  // }
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const [suggestions, setSuggestions] = useState(["Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti quod sequi quam sit. Ab, tempore assumenda alias incidunt quam voluptatibus labore eius et autem perferendis veniam suscipit odio odit corrupti.", "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti quod sequi quam sit. Ab, tempore assumenda alias incidunt quam voluptatibus labore eius et autem perferendis veniam suscipit odio odit corrupti.", "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti quod sequi quam sit. Ab, tempore assumenda alias incidunt quam voluptatibus labore eius et autem perferendis veniam suscipit odio odit corrupti."]);
  const keyboard = useRef();
  const [selectedSug, setSelectedSug] = useState(0)

  const getSuggestions = async (ct: string): Promise<string[]> => {
    const res = await fetch("http://172.20.184.35:5000/autocomplete", {
      method: "POST",
      body: JSON.stringify({ texto: ct }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    const data = await res.json()
    console.log("data", data.text)
    return data.text
  }
  const onChange = async (input: any) => {
    setInput(input);
    console.log("Input changed", input);
    if (input.length % 3 == 0) {
      let sug: Awaited<string[]> = await getSuggestions(input)
      setSuggestions(sug);
    }
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = (button: any) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();
    // make0 an enter without using \n
    if (button === "{enter}") {
      // @ts-ignore
      keyboard.current.setInput(input + "\n");
      setInput(input + "\n")
    }
  };

  const predClick = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.target as HTMLElement
    setSelectedSug(el.id as unknown as number)
    setInput(input + suggestions[el.id as unknown as number])
  }
  const onChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setInput(input);
    // @ts-ignore
    keyboard.current.setInput(input);
  };
  const tabAutCompletion = () => {
    // leave suggestions the same but remove previous word completions manually
    let arr = suggestions[selectedSug].slice()
    let narr = arr.split(" ")
    return narr[0]
  }
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key == "Tab") {
        e.preventDefault();
        let word = tabAutCompletion()
        console.log(input + word)
        setInput(input + word + " ")
        // @ts-ignore
        keyboard.current.value += word
      }
    })
  }, [input, suggestions])
  return (
    <div className="main-wrapper">
      <nav id="logo-nav">
        <img id="logo" src={dinLogo} alt="logo" />
      </nav>
      <div className="wrapper">
        <div className="container">
          {/* TODO: add fixed predictions to bottom of the textarea */}
          <div className="input-wrapper">
            <textarea className="input" onChange={onChangeInput} value={input}> </textarea>
            <div className="predictions">
              {
                suggestions.map((suggestion: string, key: number) => {
                  return <a onClick={predClick} id={key as unknown as string} className={"prediction " + (suggestions[selectedSug] == suggestion ? "active" : "")}>{suggestion}</a>
                })
              }
            </div>
          </div>
          <Keyboard
            keyboardRef={r => (keyboard.current = r)}
            theme={"hg-theme-default myTheme1"}
            layoutName={layout}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
