import React from "react";
import Home from "./page/Home.jsx";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext.jsx";
import Navbar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CountryDetails from "./page/CountryDetails.jsx";
import Login from "./page/Login.jsx";
import RegionPage from "./page/Region.jsx";
import LanguagePage from "./page/Language.jsx";
import Favorites from "./page/Favorites.jsx";
import Signup from "./page/Signup.jsx";


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
                          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>}/>
                          <Route path="*" element={<Navigate to="/" />} />
                          <Route path="/signup" element={<Signup />} />
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
