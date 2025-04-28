import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Row, Col, Spinner, Alert } from "reactstrap";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8085";

const VendorList = ({ refreshKey }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("You must be logged in to view vendors.");
      }

      const response = await axios.get(`${API_BASE_URL}/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from vendors endpoint.");
      }

      setVendors(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching vendors:", error);
      const message = error.response?.data?.message || error.message || "Error fetching vendors.";
      setError(message);
      toast.error(message, { toastId: "fetch-vendors-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
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
      <h2 className="text-primary mb-4">Vendors List</h2>
      {vendors.length === 0 ? (
        <Alert color="info" className="text-center">No vendors listed.</Alert>
      ) : (
        <Row>
          {vendors.map((vendor) => (
            <Col md="12" key={vendor.vendorId} className="mb-4">
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
                        {vendor.images && vendor.images.length > 0 ? (
                          vendor.images.map((img, idx) => (
                            <SwiperSlide key={img.imgid || idx}>
                              <img
                                src={`${API_BASE_URL}/api/images/${img.imgName}`}
                                alt={`${vendor.vendorName} view ${idx + 1}`}
                                className="w-100 h-100 object-cover"
                                onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                              />
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            <img
                              src="/placeholder-image.jpg"
                              alt={`${vendor.vendorName} placeholder`}
                              className="w-100 h-100 object-cover"
                            />
                          </SwiperSlide>
                        )}
                      </Swiper>
                    </Col>
                    <Col md="8">
                      <CardTitle tag="h4" className="text-primary fw-bold mb-3">
                        {vendor.vendorName}
                      </CardTitle>
                      <p className="mb-2">
                        <strong>Contact:</strong> {vendor.vendorContact || "N/A"}
                      </p>
                      <p className="mb-2">
                        <strong>Price:</strong> ₹{vendor.price ? vendor.price.toFixed(2) : "N/A"}
                      </p>
                      <div className="bg-light p-3 rounded mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="fw-semibold">Specialties</h5>
                        </div>
                        {vendor.vendorSpecialties && vendor.vendorSpecialties.length > 0 ? (
                          <ListGroup>
                            {vendor.vendorSpecialties.map((specialty, idx) => (
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
                        <p className="text-muted">{vendor.description || "No description provided."}</p>
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

export default VendorList;