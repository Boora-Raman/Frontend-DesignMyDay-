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

const CarterServiceList = ({ refreshKey }) => {
  const [carters, setCarters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarters = async () => {
      try {
        const response = await axios.get("http://localhost:8085/carters");
        setCarters(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch caterers");
        setLoading(false);
      }
    };
    fetchCarters();
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
      <h2 className="mb-4">Caterers</h2>
      <Row>
        {carters.map((carter) => (
          <Col md="4" key={carter.carterId} className="mb-4">
            <Card className="shadow">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="mb-3"
                style={{ height: "200px" }}
              >
                {carter.images && carter.images.length > 0 ? (
                  carter.images.map((image) => (
                    <SwiperSlide key={image.imgid}>
                      <img
                        src={`http://localhost:8085/api/images/${image.imgName}`}
                        alt={carter.carterName}
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
                <CardTitle tag="h5">{carter.carterName}</CardTitle>
                <p><strong>Contact:</strong> {carter.carterContact}</p>
                <p><strong>Cuisine:</strong> {carter.carterCuisine}</p>
                <p><strong>Services:</strong> {carter.services.map((s) => s.serviceName).join(", ") || "None"}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CarterServiceList;