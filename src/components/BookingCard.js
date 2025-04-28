import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ListGroup,
  ListGroupItem,
  Spinner,
  Alert,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const BookingCard = ({ venueId, venueName, venuePrice, onClose, onBookingSuccess }) => {
  const [stage, setStage] = useState("carters");
  const [carters, setCarters] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCarters, setSelectedCarters] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCarters = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwt");
      const response = await axios.get("http://localhost:8085/carters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarters(response.data);
      if (!response.data.every((carter) => carter.name && carter.id)) {
        console.warn("Some carters are missing 'name' or 'id' fields");
      }
    } catch (err) {
      console.error("Error fetching carters:", err);
      setError("Failed to fetch carters.");
      toast.error("Failed to fetch carters.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwt");
      const response = await axios.get("http://localhost:8085/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(response.data);
      if (!response.data.every((vendor) => vendor.name && vendor.id)) {
        console.warn("Some vendors are missing 'name' or 'id' fields");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to fetch vendors.");
      toast.error("Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCarter = (carter) => {
    setSelectedCarters((prev) =>
      prev.some((c) => c.id === carter.id)
        ? prev.filter((c) => c.id !== carter.id)
        : [...prev, carter]
    );
  };

  const handleSelectVendor = (vendor) => {
    setSelectedVendors((prev) =>
      prev.some((v) => v.id === vendor.id)
        ? prev.filter((v) => v.id !== vendor.id)
        : [...prev, vendor]
    );
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const bookingDate = new Date().toISOString().split("T")[0];
      const vendorIds = selectedVendors.map((v) => v.id);
      const carterIds = selectedCarters.map((c) => c.id);

      await axios.post(
        "http://localhost:8085/bookings",
        {
          venueId,
          bookingDate,
          vendorIds,
          carterIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Booking confirmed successfully!");
      onBookingSuccess();
      onClose();
    } catch (err) {
      console.error("Error confirming booking:", err.response || err);
      const message = err.response?.data?.error || "Failed to confirm booking.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stage === "carters") {
      fetchCarters();
    } else {
      fetchVendors();
    }
  }, [stage]);

  return (
    <Modal isOpen={true} toggle={onClose} size="lg" className="booking-card">
      <ModalHeader toggle={onClose}>
        Book {venueName} (₹{venuePrice?.toFixed(2)})
      </ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner color="primary" />
          </div>
        ) : error ? (
          <Alert color="danger">{error}</Alert>
        ) : stage === "carters" ? (
          <div>
            <h5 className="fw-semibold mb-3">Select Carters</h5>
            <ListGroup>
              {carters.length === 0 ? (
                <Alert color="info">No carters available.</Alert>
              ) : (
                carters.map((carter, index) => (
                  <ListGroupItem
                    key={carter.id || `carter-${index}`}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <p className="mb-1 fw-semibold text-primary">
                        {carter.name || "Unnamed Carter"}
                      </p>
                      <p className="mb-1 small">
                        <strong>Price:</strong> ₹
                        {carter.price?.toFixed(2) || "N/A"}
                      </p>
                      <p className="mb-0 small">
                        <strong>Specialties:</strong>{" "}
                        {carter.specialties?.length > 0
                          ? carter.specialties.join(", ")
                          : "None"}
                      </p>
                    </div>
                    <Button
                      color={
                        selectedCarters.some((c) => c.id === carter.id)
                          ? "danger"
                          : "success"
                      }
                      size="sm"
                      onClick={() => handleSelectCarter(carter)}
                    >
                      {selectedCarters.some((c) => c.id === carter.id)
                        ? "Remove"
                        : "Add"}
                    </Button>
                  </ListGroupItem>
                ))
              )}
            </ListGroup>
          </div>
        ) : (
          <div>
            <h5 className="fw-semibold mb-3">Select Vendors</h5>
            <ListGroup>
              {vendors.length === 0 ? (
                <Alert color="info">No vendors available.</Alert>
              ) : (
                vendors.map((vendor, index) => (
                  <ListGroupItem
                    key={vendor.id || `vendor-${index}`}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <p className="mb-1 fw-semibold text-primary">
                        {vendor.name || "Unnamed Vendor"}
                      </p>
                      <p className="mb-1 small">
                        <strong>Price:</strong> ₹
                        {vendor.price?.toFixed(2) || "N/A"}
                      </p>
                      <p className="mb-0 small">
                        <strong>Specialties:</strong>{" "}
                        {vendor.specialties?.length > 0
                          ? vendor.specialties.join(", ")
                          : "None"}
                      </p>
                    </div>
                    <Button
                      color={
                        selectedVendors.some((v) => v.id === vendor.id)
                          ? "danger"
                          : "success"
                      }
                      size="sm"
                      onClick={() => handleSelectVendor(vendor)}
                    >
                      {selectedVendors.some((v) => v.id === vendor.id)
                        ? "Remove"
                        : "Add"}
                    </Button>
                  </ListGroupItem>
                ))
              )}
            </ListGroup>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {stage === "vendors" && (
          <Button color="secondary" onClick={() => setStage("carters")}>
            Previous
          </Button>
        )}
        {stage === "carters" ? (
          <Button color="primary" onClick={() => setStage("vendors")}>
            Next
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={handleConfirmBooking}
            disabled={loading}
          >
            Confirm Booking
          </Button>
        )}
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BookingCard;