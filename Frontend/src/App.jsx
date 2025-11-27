import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import "react-datepicker/dist/react-datepicker.css";


function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/home" replace /> : <Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
