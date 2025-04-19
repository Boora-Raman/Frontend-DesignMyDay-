import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
  Input,
  Spinner,
  Alert,
  Label,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";

const AddServiceModal = ({ venueId, onClose, onServicesAdded }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("Authentication token missing. Please log in.");
      }

      const response = await axios.get("http://localhost:8085/services", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from services endpoint.");
      }

      setServices(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching services:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load services. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("Authentication token missing. Please log in.");
      }

      if (selectedServices.length === 0) {
        toast.warn("Please select at least one service.");
        return;
      }

      await axios.post(
        `http://localhost:8085/venues/${venueId}/services`,
        selectedServices,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Services added successfully!");
      onServicesAdded();
      onClose();
    } catch (error) {
      console.error("Error adding services:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add services. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>
      <Modal isOpen={true} toggle={onClose} centered>
        <ModalHeader toggle={onClose} className="bg-primary text-white">
          Add Services to Venue
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="text-center">
              <Spinner color="primary" />
              <p className="mt-2">Loading services...</p>
            </div>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : services.length === 0 ? (
            <Alert color="info" className="text-center">
              No services available. Please add services first.
            </Alert>
          ) : (
            <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
              {services.map((service) => (
                <ListGroupItem
                  key={service.serviceId}
                  className="d-flex align-items-center"
                >
                  <Input
                    type="checkbox"
                    id={`service-${service.serviceId}`}
                    checked={selectedServices.includes(service.serviceId)}
                    onChange={() => handleServiceToggle(service.serviceId)}
                    className="me-3"
                  />
                  <Label for={`service-${service.serviceId}`} className="mb-0 flex-grow-1">
                    <div>
                      <p className="mb-1 fw-semibold text-primary">
                        {service.serviceName}
                      </p>
                      <p className="mb-1 small">
                        Price: ₹{service.servicePrice?.toFixed(2) || "N/A"}
                      </p>
                      <p className="mb-0 small text-muted">
                        {service.serviceDescription || "No description"}
                      </p>
                    </div>
                  </Label>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleSave}
            disabled={loading || selectedServices.length === 0}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </CSSTransition>
  );
};

export default AddServiceModal;