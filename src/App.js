import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Tickets from "./pages/Tickets";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Home redirects based on login */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/projects" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Public routes (redirect if already logged in) */}
        <Route
          path="/register"
          element={token ? <Navigate to="/projects" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/projects" replace /> : <Login />}
        />

        {/* Dashboard routes — protected */}
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
