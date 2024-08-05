import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import ForgetPassword from "./pages/forgotPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
          <Route path="/cashQuester/home" element={<Home />}></Route>
          <Route path="/cashMaster/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
