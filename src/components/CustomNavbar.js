import React, { useState } from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse, Button } from "reactstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const userName = sessionStorage.getItem("name")?.trim() || "User";
  const isLoggedIn = !!sessionStorage.getItem("jwt");

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("name");
    toast.success("Logged out successfully");
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <Navbar color="light" light expand="md" className="px-4">
      <NavbarBrand tag={NavLink} to="/" className="fw-bold text-primary" style={{ fontSize: "1.8rem" }}>
        DesignMyDay
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink to="/" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/addCarters" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              Add Carters
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/getCarters" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              List Carters
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/addVendor" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              Add Vendors
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/vendorList" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              List Vendors
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/addVenues" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              Add Venues
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/getVenues" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              Venues
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/about" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              About Us
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contact" className={({ isActive }) => `nav-link text-dark ${isActive ? "fw-bold" : ""}`} onClick={() => setIsOpen(false)}>
              Contact Us
            </NavLink>
          </NavItem>
        </Nav>
        {isLoggedIn ? (
          <div className="d-flex align-items-center">
            <span className="me-3 fw-semibold text-dark">{userName}</span>
            <Button color="danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button color="primary" tag={NavLink} to="/login">
            Login
          </Button>
        )}
      </Collapse>
    </Navbar>
  );
};

export default CustomNavbar;