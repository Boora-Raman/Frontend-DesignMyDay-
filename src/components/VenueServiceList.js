import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Spinner,
  Alert,
} from "reactstrap";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";
import BookingCard from "./BookingCard";
// import "./styles.css";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const VenueServiceList = ({ refreshKey }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const toastRef = useRef(new Set());

  const fetchVenues = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("You must be logged in to view your venues.");
      }

      const decoded = decodeJWT(token);
      if (!decoded || !decoded.sub) {
        throw new Error("Invalid token: user ID not found.");
      }
      const userId = decoded.sub;

      console.log("Fetching venues for user:", userId);
      const response = await axios.get("http://localhost:8085/venues", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Venues response:", response.data);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from venues endpoint.");
      }

      setVenues(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching user venues:", error);
      setVenues([]);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error fetching your venues.";
      setError(message);
      if (!toastRef.current.has(message)) {
        toast.error(message);
        toastRef.current.add(message);
        setTimeout(() => toastRef.current.delete(message), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowInVR = (venueId) => {
    toast.info(`VR view for venue ${venueId} is not implemented yet.`);
  };

  const handleBookVenue = (venue) => {
    setSelectedVenue(venue);
  };

  useEffect(() => {
    console.log("Fetching venues due to mount or refreshKey:", refreshKey);
    fetchVenues();
  }, [refreshKey]);

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
        <div>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="text-primary fw-bold">Your Venues</h2>
            <Button color="primary" onClick={fetchVenues}>
              Refresh Venues
            </Button>
          </div>
          {venues.length === 0 ? (
            <Alert color="info" className="text-center">
              No venues listed. Add a venue to get started!
            </Alert>
          ) : (
            <Row>
              {venues.map((venue) => (
                <Col md="12" key={venue.venueId} className="mb-4">
                  <Card>
                    <CardBody className="p-4">
                      <Row>
                        <Col md="4">
                          <Swiper
                            spaceBetween={10}
                            navigation={true}
                            modules={[Navigation]}
                            className="rounded"
                            style={{ height: "200px" }}
                          >
                            {venue.images && venue.images.length > 0 ? (
                              venue.images.map((img, idx) => (
                                <SwiperSlide key={img.imgid || idx}>
                                  <img
                                    src={`http://localhost:8085/api/images/${img.imgName}`}
                                    alt={`${venue.venueName} view ${idx + 1}`}
                                    className="w-100 h-100 object-cover"
                                    onError={(e) =>
                                      (e.target.src = "/placeholder-image.jpg")
                                    }
                                  />
                                </SwiperSlide>
                              ))
                            ) : (
                              <SwiperSlide>
                                <img
                                  src="/placeholder-image.jpg"
                                  alt={`${venue.venueName} placeholder`}
                                  className="w-100 h-100 object-cover"
                                />
                              </SwiperSlide>
                            )}
                          </Swiper>
                        </Col>
                        <Col md="8">
                          <CardTitle
                            tag="h4"
                            className="text-primary fw-bold mb-3"
                          >
                            {venue.venueName}
                          </CardTitle>
                          <p className="mb-2">
                            <strong>Address:</strong>{" "}
                            {venue.venueAddress || "N/A"}
                          </p>
                          <p className="mb-2">
                            <strong>Price:</strong> ₹
                            {venue.venuePrice?.toFixed(2) || "N/A"}
                          </p>
                          
                          <div className="d-flex gap-2">
                            <Button
                              color="primary"
                              onClick={() => handleShowInVR(venue.venueId)}
                            >
                              Show in VR
                            </Button>
                            <Button
                              color="success"
                              onClick={() => handleBookVenue(venue)}
                            >
                              Book Venue
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          {selectedVenue && (
            <BookingCard
              venueId={selectedVenue.venueId}
              venueName={selectedVenue.venueName}
              venuePrice={selectedVenue.venuePrice}
              onClose={() => setSelectedVenue(null)}
              onBookingSuccess={fetchVenues}
            />
          )}
        </div>
      </CSSTransition>
    </Container>
  );
};

export default VenueServiceList;