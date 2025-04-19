import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { ToastContainer } from "react-toastify";
import UserProfile from "./components/UserProfile";
import CustomNavbar from "./components/CustomNavbar";
import AddVenueForm from "./components/AddVenueForm";
import VenueServiceList from "./components/VenueServiceList";
function App() {

  return (

    
    <Router>
      <ToastContainer position="top-center" />
      <CustomNavbar />
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        
        <Route path="/addVenues" element={<AddVenueForm />} />
        <Route path="/getVenues" element={<VenueServiceList />} />
        

        {/* <Route path="/venues" element={<Venues />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} /> */}


        </Routes>
    </Router>
  );
}

export default App;
