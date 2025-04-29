import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8085";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) {
          toast.error("Please log in to view your profile.");
          navigate("/login");
          return;
        }

        // Step 1: Get username from token
        const usernameResponse = await axios.get(`${API_BASE_URL}/username/${token}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const username = usernameResponse.data;
        if (!username) {
          throw new Error("Username not found in token response");
        }

        // Step 2: Get user details by username
        const userResponse = await axios.get(
          `${API_BASE_URL}/users/name/${encodeURIComponent(username)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = userResponse.data;
        // Log bookings to debug missing vendor/carter names
        console.log("User bookings:", userData.bookings);
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
    sessionStorage.removeItem("name");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleEditDetails = () => {
    navigate("/edit-profile");
  };

  const handleUpdatePassword = () => {
    navigate("/update-password");
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
      // Refresh user data to update booking status
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
        <Card className="mx-auto" style={{ maxWidth: "700px" }}>
          <CardBody className="p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <img
                src={
                  user?.profileImagePath
                    ? `${API_BASE_URL}/api/images/${encodeURIComponent(user.profileImagePath)}`
                    : "https://via.placeholder.com/100"
                }
                alt="Profile"
                className="rounded-circle border border-primary"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
              />
              <Button color="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
            <CardTitle tag="h3" className="text-center text-primary fw-bold mb-4">
              User Profile
            </CardTitle>
            <Row className="mb-4">
              <Col md="6">
                <p className="mb-2">
                  <strong>User ID:</strong> {user?.userId || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Username:</strong> {user?.name || "N/A"}
                </p>
              </Col>
              <Col md="6">
                <p className="mb-2">
                  <strong>Email:</strong> {user?.email || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Password:</strong> ********
                </p>
              </Col>
            </Row>
            <div className="d-flex justify-content-center gap-3 mb-4">
              <Button color="primary" onClick={handleEditDetails}>
                Edit Details
              </Button>
              <Button color="success" onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
            <h4 className="text-primary fw-bold mb-3">Booked Venues</h4>
            {user?.bookings && user.bookings.length > 0 ? (
              <ListGroup>
                {user.bookings.map((booking) => (
                  <ListGroupItem key={booking.bookingId} className="mb-2">
                    <p className="mb-1">
                      <strong>Booking ID:</strong> {booking.bookingId || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Venue:</strong> {booking.venue?.venueName || "N/A"}
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
                      <strong>Total Price:</strong> ₹
                      {booking.totalPrice?.toFixed(2) || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Booking Date:</strong>{" "}
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong> {booking.status || "N/A"}
                    </p>
                    {booking.status === "Pending" && (
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleCancelBooking(booking.bookingId)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </ListGroupItem>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted text-center">No venues booked yet.</p>
            )}
          </CardBody>
        </Card>
      </CSSTransition>
    </Container>
  );
};

export default UserProfile;