import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Tickets from "./pages/Tickets";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect home to projects */}
        <Route path="/" element={<Navigate to="/projects" />} />

        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard routes (wrapped with Layout) */}
        <Route
          path="/projects"
          element={
            <Layout>
              <Projects />
            </Layout>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <Layout>
              <Tickets />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
