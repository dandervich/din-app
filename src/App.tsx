import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./App.css";
import dinLogo from "./assets/Mask group.svg"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyDqhabtnl-P-TByPWa5fuzOusFniWnbZfE")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

async function getSuggestionFromGemini(inputText: string): Promise<string> {
  if (!genAI) {
    console.error('API key no configurada')
    return ''
  }

  try {
    const prompt = `Completar esta palabra o frase, y ademas si ya esta empezada la palabra completarla, no escribirla de 0, que tu respuesta sea solo el completado: "${inputText}"`
    const result = await model.generateContent(prompt)
    const suggestion = result.response.text()
    console.log('Sugerencia recibida de Gemini:', suggestion)
    return suggestion.startsWith(inputText) ? suggestion.slice(inputText.length) : suggestion
  } catch (error) {
    console.error('Error al obtener sugerencia de Gemini:', error)
    return ''
  }
}

function App() {
  const [input, setInput] = useState("");
  const [suggestionInput, setSuggestionInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [layout, setLayout] = useState("default");
  const [suggestions, setSuggestions] = useState(["hola", "hola, todo bien", "hola, bien vos?"]);
  const keyboard = useRef();
  const [secsuggestions, setSecSuggestions] = useState("hola");
  const [selectedSug, setSelectedSug] = useState(0)

  useEffect(() => {
    if (input) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const geminiSuggestion = await getSuggestionFromGemini(input)
          setSuggestionInput(geminiSuggestion)
        } catch (error) {
          console.error('Error al obtener sugerencia de Gemini:', error)
          setSuggestionInput('')
        } finally {
          setIsLoading(false)
        }
      }, 300)
    } else {
      setSuggestionInput('')
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && suggestionInput) {
        e.preventDefault();
        const newInput = input + suggestionInput.trim();
        setInput(newInput);
        // @ts-ignore
        keyboard.current?.setInput(newInput);
        setSuggestionInput('');
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      document.removeEventListener('keydown', handleTabKey);
    }
  }, [input, suggestionInput])

  const inactivityTime = () => {
    var time = 0;
    window.onload = resetTimer;
    var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(function (name) {
      document.addEventListener(name, resetTimer, true);
    });
    function resetTimer() {
      clearTimeout(time);
      const gs = async () => {
        let sug: Awaited<string[]> = await getSuggestions(input)
        setSuggestions(sug);
        setSecSuggestions(sug[0]);
      }
      time = setTimeout(gs, 3000)
    }
  };

  const getSuggestions = async (ct: string): Promise<string[]> => {
    const res = await fetch("http://10.4.48.143:3000/autocomplete", {
      method: "POST",
      body: JSON.stringify({ texto: ct }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    const data = await res.json()
    return data
  }

  const onChange = async (input: any) => {
    setInput(input);
    console.log("Input changed", input);

    if (input.length % 3 === 0) {
      let sug: Awaited<string[]> = await getSuggestions(input)
      setSuggestions(sug);
    }
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = async (button: any) => {
    console.log("Button pressed", button);
    if (button === "{tab}" && suggestionInput) {
      const newInput = input + suggestionInput.trim();
      setInput(newInput);
      // @ts-ignore
      keyboard.current?.setInput(newInput);
      setSuggestionInput("");
      return;
    }

    if (button === "{shift}" || button === "{lock}") handleShift();

    if (button === "{enter}") {
      const newInput = input + "\n";
      setInput(newInput);
      // @ts-ignore
      keyboard.current?.setInput(newInput);
    }

    if (button === "{bksp}") {
      const newInput = input.slice(0, -1);
      setInput(newInput);
      // @ts-ignore
      keyboard.current?.setInput(newInput);
    }
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setInput(input);
    // @ts-ignore
    keyboard.current?.setInput(input);
  };

  const predClick = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.target as HTMLElement;
    const index = parseInt(el.id);
    setSelectedSug(index);
    const newInput = suggestions[index];
    setInput(newInput);
    // @ts-ignore
    keyboard.current?.setInput(newInput);
  }

  return (
    <div className="main-wrapper">
      <nav id="logo-nav">
        <img id="logo" src={dinLogo} alt="logo" />
      </nav>
      <div className="wrapper">
        <div className="container">
          <div className="input-wrapper relative">
            <p className="input-sug">
              {isLoading ? input : suggestionInput ? input + suggestionInput : input}
            </p>
            <textarea
              ref={inputRef}
              className="input"
              onChange={onChangeInput}
              value={input}
            ></textarea>
            <div className="predictions">
              {suggestions?.map((suggestion: string, key: number) => (
                <a
                  key={key}
                  onClick={predClick}
                  id={key as unknown as string}
                  className={"prediction " + (suggestions[selectedSug] == suggestion ? "active" : "")}
                >
                  {suggestion}
                </a>
              ))}
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
}

export default App;