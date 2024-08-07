import React, { AnchorHTMLAttributes, HTMLAttributeAnchorTarget, useEffect, useRef, useState } from "react";
import "./App.css";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
function App() {
  // async function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  //   setCurrentInput(e.target.value);
  //   // await invoke("current_input", { ci: e.target.value }); // eventually will run the AI model
  // }
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const [suggestions, setSuggestions] = useState(["Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti quod sequi quam sit. Ab, tempore assumenda alias incidunt quam voluptatibus labore eius et autem perferendis veniam suscipit odio odit corrupti.", "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti quod sequi quam sit. Ab, tempore assumenda alias incidunt quam voluptatibus labore eius et autem perferendis veniam suscipit odio odit corrupti.1", "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti quod sequi quam sit. Ab, tempore assumenda alias incidunt quam voluptatibus labore eius et autem perferendis veniam suscipit odio odit corrupti.2"]);
  const keyboard = useRef();
  const [selectedSug, setSelectedSug] = useState(0)

  const getSuggestions = async (ct: string): Promise<string[]> => {
    const res = await fetch("http://10.8.17.10:5000/autocomplete", {
      method: "POST",
      body: JSON.stringify({texto: ct}),
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
    if(input.length % 3 == 0) {
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
    // make an enter without using \n
    if (button === "{enter}") {
      // @ts-ignore
      keyboard.current.setInput(input + "\n");
      setInput(input + "\n")
    }
  };

  const predClick = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.target as HTMLElement
    setSelectedSug(el.id as unknown as number)
  }
  const onChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setInput(input);
    // @ts-ignore
    keyboard.current.setInput(input);
  };
  const tabAutCompletion = () => {
    let arr = suggestions[selectedSug].slice()
    let narr = arr.split(" ")
    return narr[0]
  }
  useEffect(()=> {
    document.addEventListener("keydown", (e)=> {
      if(e.key == "Tab"){
        e.stopImmediatePropagation();
        e.preventDefault();
        let word = tabAutCompletion()
        console.log(input)
        setInput(input + word + " ")
        let sug = suggestions[selectedSug].split(" ")
        sug.shift()
        suggestions[selectedSug] = sug.join(" ")
        setSuggestions(suggestions)
      }
    })
  }, [input])
  return (
    // TODO: add navbar with logo and eventually we can put language settings there.
    <div className="wrapper">
      <div className="container">
        {/* TODO: add fixed predictions to bottom of the textarea */}
        <div className="input-wrapper">
          <textarea className="input" onChange={onChangeInput} value={input}> </textarea>
          <div className="predictions">
            {
              suggestions.map((suggestion: string, key: number) => {
                  return <a onClick={predClick} id={key as unknown as string} className={"prediction "+ (suggestions[selectedSug] == suggestion ? "active" : "")}>{suggestion}</a>
              })
            }
          </div>
        </div>
        <Keyboard
          keyboardRef={r => (keyboard.current = r)}
          layoutName={layout}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </div>
  );
};

export default App;
