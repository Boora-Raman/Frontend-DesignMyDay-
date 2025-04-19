import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Button,
  Spinner,
  Alert,
  ListGroup,
  ListGroupItem,
  Row,
  Col
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem("jwt");
        if (!token) {
          toast.error("No authentication token found. Please log in.");
          navigate("/login");
          return;
        }

        const usernameResponse = await axios.get(`http://localhost:8085/username/${token}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const username = usernameResponse.data;
        if (!username) {
          throw new Error("Username not found in token response");
        }

        const userResponse = await axios.get(
          `http://localhost:8085/users/name/${encodeURIComponent(username)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(userResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user details:", err);
        if (err.response) {
          if (err.response.status === 401) {
            setError("Unauthorized. Please log in again.");
            navigate("/login");
          } else if (err.response.status === 404) {
            setError("User not found.");
          } else if (err.response.status === 400) {
            setError("Invalid or expired token.");
          } else {
            setError("Failed to load user details. Please try again.");
          }
        } else if (err.message.includes("Network Error")) {
          setError("Network error. Please check if the backend server is running or CORS is configured correctly.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchUserDetails();
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
      <Card className="shadow-lg mx-auto" style={{ maxWidth: "800px" }}>
        <CardBody className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <img
              src={
                user?.images?.imgName
                  ? `http://localhost:8085/api/images/${encodeURIComponent(user.images.imgName)}`
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
          <CardTitle tag="h4" className="text-center text-primary fw-bold mb-4">
            User Profile
          </CardTitle>
          <Row className="mb-4">
            <Col md="6">
              <p>
                <strong>User ID:</strong> {user?.userId}
              </p>
              <p>
                <strong>Username:</strong> {user?.name}
              </p>
            </Col>
            <Col md="6">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
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
          <h5 className="text-primary fw-bold mb-3">Venues</h5>
          {user?.venues && user.venues.length > 0 ? (
            <ListGroup>
              {user.venues.map((venue, index) => (
                <ListGroupItem key={index} className="mb-2 border rounded">
                  <p>
                    <strong>Name:</strong> {venue.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {venue.location}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {venue.capacity}
                  </p>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted">No venues associated with this user.</p>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default UserProfile;
