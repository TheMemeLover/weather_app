import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Home"
import NextDays from "./NextDays"
import ScreenLayout from "/Layouts/ScreenLayout"

function App() {
  return (
    <BrowserRouter>
		<Routes>
      <Route path="/" element={<ScreenLayout />}>
        <Route index element={<Home />} />
        <Route path="NextDays" element={<NextDays />} />
      </Route>
    </Routes>
	</BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)