import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavbarToggler,
  Collapse,
  Button,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const userName = sessionStorage.getItem("name")?.trim();
  const isLoggedIn = !!userName && userName !== "null";

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
      <NavbarBrand tag={Link} to="/" className="fw-bold text-primary" style={{ fontSize: "1.8rem" }}>
        DesignMyDay
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link to="/" className="nav-link text-dark" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/addVenues" className="nav-link text-dark" onClick={() => setIsOpen(false)}>
              Add Venues
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/getVenues" className="nav-link text-dark" onClick={() => setIsOpen(false)}>
              Venues
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/about" className="nav-link text-dark" onClick={() => setIsOpen(false)}>
              About Us
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/contact" className="nav-link text-dark" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>
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
          <Button color="primary" tag={Link} to="/login">
            Login
          </Button>
        )}
      </Collapse>
    </Navbar>
  );
};

export default CustomNavbar;