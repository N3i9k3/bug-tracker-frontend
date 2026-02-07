import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Tickets from "./pages/Tickets";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Optional: redirect logged-in users away from login/register
function LoggedInRedirect({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/projects" replace /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home always goes to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route
          path="/register"
          element={
            <LoggedInRedirect>
              <Register />
            </LoggedInRedirect>
          }
        />
        <Route
          path="/login"
          element={
            <LoggedInRedirect>
              <Login />
            </LoggedInRedirect>
          }
        />

        {/* Protected dashboard routes */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Layout>
                <Projects />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
