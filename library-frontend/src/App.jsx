import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"; // Ensure this matches your file name (index.css or App.css)

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookPages from "./pages/BookPages";
import Students from "./pages/StudentPage";
import IssueBook from "./pages/IssueBook";
import Profile from "./pages/Profile"
// Components
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES (No Navbar) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- PROTECTED ROUTES (Has Navbar) --- */}

        <Route element={<Layout />}>
          <Route path="/books" element={<BookPages />} />
          <Route path="/students" element={<Students />} />
          <Route path="/issues" element={<IssueBook />} />
           <Route path="/profile" element={<Profile/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;