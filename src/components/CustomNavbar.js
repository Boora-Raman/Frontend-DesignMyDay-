import React from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem("jwt");

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("userId");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Navbar color="dark" dark expand="md" className="mb-4">
      <NavbarBrand href="/">DesignMyDay</NavbarBrand>
      <Nav className="ms-auto" navbar>
        <NavItem>
          <NavLink href="/venues">Venues</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/vendors">Vendors</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/carters">Caterers</NavLink>
        </NavItem>
        {isLoggedIn ? (
          <>
            <NavItem>
              <NavLink href="/profile">Profile</NavLink>
            </NavItem>
            <NavItem>
              <Button color="danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </NavItem>
          </>
        ) : (
          <>
            <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/signup">Signup</NavLink>
            </NavItem>
          </>
        )}
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;