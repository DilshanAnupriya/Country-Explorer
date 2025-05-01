import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {AuthProvider} from "./context/AuthContext.jsx";
import Navbar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import CountryDetails from "./pages/CountryDetails.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Favorites from "./pages/Favorites.jsx";
import Region from "./pages/Region.jsx";
import LanguagePage from "./pages/Language.jsx";
import RegionPage from "./pages/Region.jsx";


function App() {


  return (
      <AuthProvider>
          <Router>
              <div className="min-h-screen bg-gray-100">
                  <Navbar />
                  <main className="container mx-auto px-4 py-8">
                      <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/country/:code" element={<CountryDetails />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/region" element={<RegionPage />} />
                          <Route path="/language" element={<LanguagePage />} />
                          <Route
                              path="/favorites"
                              element={
                                  <ProtectedRoute>
                                      <Favorites />
                                  </ProtectedRoute>
                              }
                          />
                          <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                  </main>
                  <footer className="bg-gray-800 text-white p-4 text-center">
                      <p>Countries Explorer &copy; 2025</p>
                  </footer>
              </div>
          </Router>
      </AuthProvider>
  )
}

export default App
