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
import { Link } from "react-router-dom";

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const userName = sessionStorage.getItem("name")?.trim();
  const userImage = sessionStorage.getItem("image")?.trim();

  // Valid login check
  const isLoggedIn =
    Boolean(userName && userImage && userName !== "null" && userImage !== "null");

  return (
    <Navbar color="light" light expand="md" className="px-4 shadow-sm">
      <NavbarBrand tag={Link} to="/" className="fw-bold" style={{ fontSize: "1.5rem" }}>
        DesignMyDay!
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <Link className="nav-link" to="/">Home</Link>
          </NavItem>

          {/* <Route path="/addVenues" element={<AddVenueForm />} />
        <Route path="/getVenues" element={<VenueServiceList />} /> */}

        <NavItem>
            <Link className="nav-link" to="/addVenues"> Add Venues</Link>
          </NavItem>       

          <NavItem>
            <Link className="nav-link" to="/getVenues">Venues</Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/about">About Us</Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="/contact">Contact Us</Link>
          </NavItem>
        </Nav>

        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className="d-flex align-items-center gap-2 text-decoration-none text-dark"
          >
            <img
              src={userImage}
              alt="User"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span className="fw-semibold">{userName}</span>
          </Link>
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
