import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Spinner,
} from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import axios from "axios";
import { toast } from "react-toastify";

const VendorServiceList = ({ refreshKey }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:8085/vendors");
        setVendors(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch vendors");
        setLoading(false);
      }
    };
    fetchVendors();
  }, [refreshKey]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Vendors</h2>
      <Row>
        {vendors.map((vendor) => (
          <Col md="4" key={vendor.vendorId} className="mb-4">
            <Card className="shadow">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="mb-3"
                style={{ height: "200px" }}
              >
                {vendor.images && vendor.images.length > 0 ? (
                  vendor.images.map((image) => (
                    <SwiperSlide key={image.imgid}>
                      <img
                        src={`http://localhost:8085/api/images/${image.imgName}`}
                        alt={vendor.vendorName}
                        className="img-fluid"
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <img
                      src="https://via.placeholder.com/300"
                      alt="No image"
                      className="img-fluid"
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                  </SwiperSlide>
                )}
              </Swiper>
              <CardBody>
                <CardTitle tag="h5">{vendor.vendorName}</CardTitle>
                <p><strong>Contact:</strong> {vendor.vendorContact}</p>
                <p><strong>Specialty:</strong> {vendor.vendorSpecialty}</p>
                <p><strong>Services:</strong> {vendor.services.map((s) => s.serviceName).join(", ") || "None"}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VendorServiceList;