import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import CustomNavbar from "./components/CustomNavbar";
import AddVenueForm from "./components/AddVenueForm";
import VenueServiceList from "./components/VenueServiceList";
import { CSSTransition } from "react-transition-group";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleVenueAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Router>
      <div className="min-vh-100">
        <ToastContainer position="top-center" autoClose={3000} />
        <CustomNavbar />
        <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/addVenues" element={<AddVenueForm onVenueAdded={handleVenueAdded} />} />
            <Route path="/getVenues" element={<VenueServiceList onVenueAdded={refreshKey} />} />
          </Routes>
        </CSSTransition>
      </div>
    </Router>
  );
}

export default App;