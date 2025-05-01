import React, { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Button,
  Badge,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.53.163.51:8085";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const name = sessionStorage.getItem("name");
        
        const token = sessionStorage.getItem("jwt");
        if (!token) {
          toast.error("Please log in to view your profile.");
          navigate("/login");
          return;
        }

        // Step 1: Get username from token
        if (!name) {
          throw new Error("Username not found in token response");
        }

        // Step 2: Get user details by username
        const userResponse = await axios.get(
          `${API_BASE_URL}/users/name/${encodeURIComponent(name)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = userResponse.data;
        console.log("User bookings:", userData.bookings); // Debug bookings data
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user dashboard:", err);
        let errorMessage = "Failed to load user dashboard.";
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = "Unauthorized. Please log in again.";
            navigate("/login");
          } else if (err.response.status === 403) {
            errorMessage = "Access forbidden. Please check your permissions.";
          } else if (err.response.status === 404) {
            errorMessage = "User not found.";
          } else if (err.response.status === 400) {
            errorMessage = "Invalid or expired token.";
          }
        } else if (err.message.includes("Network Error")) {
          errorMessage = "Network error. Please check your connection.";
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchUserDashboard();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("name");
    
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = sessionStorage.getItem("jwt");
      await axios.put(
        `${API_BASE_URL}/bookings/cancel/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Booking cancelled successfully!");
      const username = user.name;
      const userResponse = await axios.get(
        `${API_BASE_URL}/users/name/${encodeURIComponent(username)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(userResponse.data);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error("Failed to cancel booking.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert color="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>
        <div className="bg-light rounded-3 p-4 shadow-sm">
          <Row className="align-items-center mb-4">
            <Col xs="auto">
              <img
                src={
                  user?.profileImagePath
                    ? `${API_BASE_URL}/api/images/${encodeURIComponent(user.profileImagePath)}`
                    : "https://via.placeholder.com/100"
                }
                alt="Profile"
                className="rounded-circle border border-primary"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
              />
            </Col>
            <Col>
              <h2 className="text-primary fw-bold mb-0">{user?.name || "N/A"} </h2>
              {/* <p className="text-muted mb-0">{user?.email || "No email provided"}</p> */}
            </Col>
            <Col xs="auto">
              <Button color="danger" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md="12">
              <div className="bg-white p-3 rounded-3 shadow-sm">
                <h5 className="text-primary fw-bold mb-3">Profile Details</h5>
                <p className="mb-2">
                  <strong>User ID:</strong> {user?.userId || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Username:</strong> {user?.name || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {user?.email || "N/A"}
                </p>
              </div>
            </Col>
          </Row>

          <h4 className="text-primary fw-bold mb-3">Your Bookings</h4>
          {user?.bookings && user.bookings.length > 0 ? (
            <ListGroup>
              {user.bookings.map((booking) => (
                <ListGroupItem
                  key={booking.bookingId}
                  className="mb-3 p-3 bg-white rounded-3 shadow-sm"
                >
                  <Row>
                    <Col md="8">
                      <p className="mb-1">
                        <FaMapMarkerAlt className="me-2 text-primary" />
                        <strong>Venue:</strong> {booking.venue?.venueName || "N/A"}
                      </p>
                      <p className="mb-1">
                        <FaInfoCircle className="me-2 text-primary" />
                        <strong>Booking ID:</strong> {booking.bookingId || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Vendors:</strong>{" "}
                        {booking.vendors?.length > 0
                          ? booking.vendors.map((v) => v.vendorName || "Unknown Vendor").join(", ")
                          : "None"}
                      </p>
                      <p className="mb-1">
                        <strong>Carters:</strong>{" "}
                        {booking.carters?.length > 0
                          ? booking.carters.map((c) => c.carterName || "Unknown Carter").join(", ")
                          : "None"}
                      </p>
                      <p className="mb-1">
                        <FaMoneyBillWave className="me-2 text-primary" />
                        <strong>Total Price:</strong> ₹{booking.totalPrice?.toFixed(2) || "N/A"}
                      </p>
                      <p className="mb-1">
                        <FaCalendarAlt className="me-2 text-primary" />
                        <strong>Booking Date:</strong>{" "}
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Status:</strong>{" "}
                        <Badge
                          color={booking.status === "Pending" ? "warning" : "secondary"}
                        >
                          {booking.status || "N/A"}
                        </Badge>
                      </p>
                    </Col>
                    <Col md="4" className="d-flex align-items-center justify-content-end">
                      {booking.status === "Pending" && (
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.bookingId)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <Alert color="info" className="text-center">
              No venues booked yet. Start planning your event!
            </Alert>
          )}
        </div>
      </CSSTransition>
    </Container>
  );
};

export default UserProfile;