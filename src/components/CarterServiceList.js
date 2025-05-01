import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Row, Col, Spinner, Alert } from "reactstrap";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.53.163.51:8085";

const CarterServiceList = ({ refreshKey }) => {
  const [carters, setCarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCarters = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("You must be logged in to view carters.");
      }

      const response = await axios.get(`${API_BASE_URL}/carters`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from carters endpoint.");
      }

      setCarters(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching carters:", error);
      const message = error.response?.data?.message || error.message || "Error fetching carters.";
      setError(message);
      toast.error(message, { toastId: "fetch-carters-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarters();
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
      <h2 className="text-primary mb-4">Carters List</h2>
      {carters.length === 0 ? (
        <Alert color="info" className="text-center">No carters listed.</Alert>
      ) : (
        <Row>
          {carters.map((carter) => (
            <Col md="12" key={carter.carterId} className="mb-4">
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
                        {carter.images && carter.images.length > 0 ? (
                          carter.images.map((img, idx) => (
                            <SwiperSlide key={img.imgid || idx}>
                              <img
                                src={`${API_BASE_URL}/api/images/${img.imgName}`}
                                alt={`${carter.carterName} view ${idx + 1}`}
                                className="w-100 h-100 object-cover"
                                onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                              />
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            <img
                              src="/placeholder-image.jpg"
                              alt={`${carter.carterName} placeholder`}
                              className="w-100 h-100 object-cover"
                            />
                          </SwiperSlide>
                        )}
                      </Swiper>
                    </Col>
                    <Col md="8">
                      <CardTitle tag="h4" className="text-primary fw-bold mb-3">
                        {carter.carterName}
                      </CardTitle>
                      <p className="mb-2">
                        <strong>Contact:</strong> {carter.carterContact || "N/A"}
                      </p>
                      <p className="mb-2">
                        <strong>Price:</strong> ₹{carter.price ? carter.price.toFixed(2) : "N/A"}
                      </p>
                      <div className="bg-light p-3 rounded mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="fw-semibold">Specialties</h5>
                        </div>
                        {carter.carterSpecialties && carter.carterSpecialties.length > 0 ? (
                          <ListGroup>
                            {carter.carterSpecialties.map((specialty, idx) => (
                              <ListGroupItem key={idx} className="d-flex justify-content-between align-items-center">
                                <p className="mb-1 fw-semibold text-primary">{specialty}</p>
                              </ListGroupItem>
                            ))}
                          </ListGroup>
                        ) : (
                          <p className="text-muted">No specialties listed.</p>
                        )}
                      </div>
                      <div className="bg-light p-3 rounded">
                        <h5 className="fw-semibold mb-2">Description</h5>
                        <p className="text-muted">{carter.description || "No description provided."}</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CarterServiceList;