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
import AddCarterForm from "./components/AddCarterForm";
import AddVendorForm from "./components/AddVendorForm";
import VendorList from "./components/VendorList";
import CarterServiceList from "./components/CarterServiceList";
import { CSSTransition } from "react-transition-group";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleItemAdded = () => {
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
            <Route path="/addVenues" element={<AddVenueForm onVenueAdded={handleItemAdded} />} />
            <Route path="/getVenues" element={<VenueServiceList refreshKey={refreshKey} />} />
            <Route path="/addCarters" element={<AddCarterForm onCarterAdded={handleItemAdded} />} />
            <Route path="/getCarters" element={<CarterServiceList refreshKey={refreshKey} />} />
            <Route path="/addVendor" element={<AddVendorForm onVendorAdded={handleItemAdded} />} />
            <Route path="/vendorList" element={<VendorList refreshKey={refreshKey} />} />
          </Routes>
        </CSSTransition>
      </div>
    </Router>
  );
}

export default App;