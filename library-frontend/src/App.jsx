import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css"; 


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookPages from "./pages/BookPages";
import Students from "./pages/StudentPage";
import IssueBook from "./pages/IssueBook";
import Profile from "./pages/Profile";
import MyBooks from "./pages/MyBooks"; 


import Layout from "./components/Layout";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route element={<Layout />}>
          

          <Route path="/books" element={<BookPages />} /> 


          <Route path="/my-books" element={
              <PrivateRoute>
                <MyBooks />
              </PrivateRoute>
          } />

          <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
          } />

          <Route path="/students" element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
          } />

          <Route path="/issues" element={
              <PrivateRoute>
                <IssueBook />
              </PrivateRoute>
          } />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;