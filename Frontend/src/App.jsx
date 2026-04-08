import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import "react-datepicker/dist/react-datepicker.css";


function App() {
  const hasAuth = () => {
    const token = localStorage.getItem("token");
    const hasCookie = document.cookie
      ?.split(";")
      .some((c) => c.trim().startsWith("access_token="));
    return Boolean(token || hasCookie);
  };

  const RequireAuth = ({ children }) =>
    hasAuth() ? children : <Navigate to="/dashboard" replace />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={hasAuth() ? <Navigate to="/home" replace /> : <Dashboard />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/login" element={hasAuth() ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/register" element={hasAuth() ? <Navigate to="/home" replace /> : <Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
