import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import CustomNavbar from "./components/CustomNavbar";
import VenueServiceList from "./components//VenueServiceList";
import VendorServiceList from "./components/VendorServiceList";
import CarterServiceList from "./components/CarterServiceList";

const App = () => {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/venues" element={<VenueServiceList refreshKey={0} />} />
        <Route path="/vendors" element={<VendorServiceList refreshKey={0} />} />
        <Route path="/carters" element={<CarterServiceList refreshKey={0} />} />
        <Route path="/" element={<VenueServiceList refreshKey={0} />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;