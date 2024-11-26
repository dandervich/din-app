'use client'

import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const genAI = new GoogleGenerativeAI("AIzaSyDu9bI10L_Ueuq2iY8pe0E8xqoEZVDSaws")
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

async function getSuggestionFromGemini(inputText: string): Promise<string> {
  if (!genAI) {
    console.error('API key no configurada')
    return ''
  }

  try {
    const prompt = `Completar esta palabra o frase con menos de 5 palabras y ademas si ya esta empezada la palabra completarla, no escribirla de 0, que tu respuesta sea solo el completado: "${inputText}"`
    console.log('Enviando prompt a Gemini:', prompt)
    const result = await model.generateContent(prompt)
    const suggestion = result.response.text()
    console.log('Sugerencia recibida de Gemini:', suggestion)
    return suggestion.startsWith(inputText) ? suggestion.slice(inputText.length) : suggestion
  } catch (error) {
    console.error('Error al obtener sugerencia de Gemini:', error)
    return ''
  }
}

export default function Component() {
  const [inputText, setInputText] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (inputText) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const geminiSuggestion = await getSuggestionFromGemini(inputText)
          setSuggestion(geminiSuggestion)
        } catch (error) {
          console.error('Error al obtener sugerencia de Gemini:', error)
          setSuggestion('')
        } finally {
          setIsLoading(false)
        }
      }, 300)
    } else {
      setSuggestion('')
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [inputText])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault()
      setInputText(inputText + suggestion)
      setSuggestion('')
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Texto enviado:', inputText)
    setInputText('')
    setSuggestion('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Sparkles className="mr-2 h-6 w-6" />
            Autocompletado con Gemini
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="pr-10 bg-transparent text-lg"
                placeholder="Empieza a escribir..."
              />
              <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                <span className="text-lg ml-3">
                  {inputText}
                  <AnimatePresence>
                    {isLoading ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="ml-1 inline-block"
                      >
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </motion.span>
                    ) : suggestion ? (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-gray-400"
                      >
                        {suggestion}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white">
              <Send className="mr-2 h-4 w-4" /> Enviar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <p className="text-sm text-gray-600 text-center w-full">
            Presiona <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Tab</kbd> para aceptar la sugerencia
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


