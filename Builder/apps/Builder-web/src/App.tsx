import { Component, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import ComponentPreview from './components/ComponentPreview'
import FormBuilder from './components/FormBuilder'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <ComponentPreview /> */}
      <FormBuilder/>
    </>
  )
}

export default App
