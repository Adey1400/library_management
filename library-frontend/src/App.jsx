import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import BooksPages from './pages/BookPages';
import Students from './pages/StudentPage';
import IssueBook from './pages/IssueBook';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
         <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<BooksPages />} />
          <Route path="/students" element={<Students/>}/>
          <Route path="/issues" element={<IssueBook />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
