import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import "./App.scss";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import ContentView from "./pages/content/Layout";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="content" element={<ContentView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
