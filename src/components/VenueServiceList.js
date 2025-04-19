import React, { useEffect, useState, useRef } from "react";
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
import AddServiceModal from "./AddServiceModel";
import { toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";

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
  const [selectedVenueId, setSelectedVenueId] = useState(null);
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
      const response = await axios.get(`http://localhost:8085/venues/user/${userId}`, {
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

  const handleDeleteService = async (venueId, serviceId) => {
    try {
      const token = sessionStorage.getItem("jwt");
      await axios.delete(`http://localhost:8085/venues/${venueId}/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service removed successfully!");
      await fetchVenues();
    } catch (error) {
      console.error("Error deleting service:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete service.";
      setError(message);
      toast.error(message);
    }
  };

  const handleShowInVR = (venueId) => {
    toast.info(`VR view for venue ${venueId} is not implemented yet.`);
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
                                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
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
                          <CardTitle tag="h4" className="text-primary fw-bold mb-3">
                            {venue.venueName}
                          </CardTitle>
                          <p className="mb-2">
                            <strong>Address:</strong> {venue.venueAddress || "N/A"}
                          </p>
                          <p className="mb-2">
                            <strong>Price:</strong> ₹{venue.venuePrice?.toFixed(2) || "N/A"}
                          </p>
                          <div className="bg-light p-3 rounded mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h5 className="fw-semibold">Services Offered</h5>
                              <Button
                                color="success"
                                size="sm"
                                onClick={() => setSelectedVenueId(venue.venueId)}
                              >
                                Add Services
                              </Button>
                            </div>
                            {venue.services && venue.services.length > 0 ? (
                              <ListGroup>
                                {venue.services.map((service) => (
                                  <ListGroupItem
                                    key={service.serviceId}
                                    className="d-flex justify-content-between align-items-center"
                                  >
                                    <div>
                                      <p className="mb-1 fw-semibold text-primary">
                                        {service.serviceName}
                                      </p>
                                      <p className="mb-1 small">
                                        <strong>Price:</strong> ₹{service.servicePrice?.toFixed(2) || "N/A"}
                                      </p>
                                      <p className="mb-0 small">
                                        <strong>Description:</strong>{" "}
                                        {service.serviceDescription || "No description"}
                                      </p>
                                    </div>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleDeleteService(venue.venueId, service.serviceId)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
                                  </ListGroupItem>
                                ))}
                              </ListGroup>
                            ) : (
                              <p className="text-muted">No services listed.</p>
                            )}
                          </div>
                          <Button
                            color="primary"
                            onClick={() => handleShowInVR(venue.venueId)}
                          >
                            Show in VR
                          </Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          {selectedVenueId && (
            <AddServiceModal
              venueId={selectedVenueId}
              onClose={() => setSelectedVenueId(null)}
              onServicesAdded={fetchVenues}
            />
          )}
        </div>
      </CSSTransition>
    </Container>
  );
};

export default VenueServiceList;