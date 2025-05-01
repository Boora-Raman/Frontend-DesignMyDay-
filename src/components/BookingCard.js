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
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://13.53.163.51:8085";

const BookingCard = ({ venueId, venueName, venuePrice, onClose, onBookingSuccess }) => {
  const [stage, setStage] = useState("carters");
  const [carters, setCarters] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCarters, setSelectedCarters] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCarters = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("You must be logged in to fetch carters.");
      }
      const response = await axios.get(`${API_BASE_URL}/carters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from carters endpoint.");
      }
      setCarters(response.data);
      if (!response.data.every((carter) => carter.carterId && carter.carterName)) {
        console.warn("Some carters are missing 'carterId' or 'carterName' fields");
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
      if (!token) {
        throw new Error("You must be logged in to fetch vendors.");
      }
      const response = await axios.get(`${API_BASE_URL}/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format from vendors endpoint.");
      }
      setVendors(response.data);
      if (!response.data.every((vendor) => vendor.vendorId && vendor.vendorName)) {
        console.warn("Some vendors are missing 'vendorId' or 'vendorName' fields");
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
      prev.some((c) => c.carterId === carter.carterId)
        ? prev.filter((c) => c.carterId !== carter.carterId)
        : [...prev, carter]
    );
  };

  const handleSelectVendor = (vendor) => {
    setSelectedVendors((prev) =>
      prev.some((v) => v.vendorId === vendor.vendorId)
        ? prev.filter((v) => v.vendorId !== vendor.vendorId)
        : [...prev, vendor]
    );
  };

  const validateBookingDate = () => {
    if (!bookingDate) {
      setDateError("Booking date is required.");
      return false;
    }
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for comparison
    if (selectedDate < today) {
      setDateError("Booking date cannot be in the past.");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateBookingDate()) {
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const vendorIds = selectedVendors
        .map((v) => v.vendorId)
        .filter((id) => id != null);
      const carterIds = selectedCarters
        .map((c) => c.carterId)
        .filter((id) => id != null);

      if (!venueId) {
        throw new Error("Venue ID is required.");
      }

      await axios.post(
        `${API_BASE_URL}/bookings`,
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
      const message = err.response?.data || "Failed to confirm booking.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stage === "carters") {
      fetchCarters();
    } else if (stage === "vendors") {
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
                    key={carter.carterId || `carter-${index}`}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <p className="mb-1 fw-semibold text-primary">
                        {carter.carterName || "Unnamed Carter"}
                      </p>
                      <p className="mb-1 small">
                        <strong>Price:</strong> ₹
                        {carter.price?.toFixed(2) || "N/A"}
                      </p>
                      <p className="mb-0 small">
                        <strong>Specialties:</strong>{" "}
                        {carter.carterSpecialties?.length > 0
                          ? carter.carterSpecialties.join(", ")
                          : "None"}
                      </p>
                    </div>
                    <Button
                      color={
                        selectedCarters.some((c) => c.carterId === carter.carterId)
                          ? "danger"
                          : "success"
                      }
                      size="sm"
                      onClick={() => handleSelectCarter(carter)}
                    >
                      {selectedCarters.some((c) => c.carterId === carter.carterId)
                        ? "Remove"
                        : "Add"}
                    </Button>
                  </ListGroupItem>
                ))
              )}
            </ListGroup>
          </div>
        ) : stage === "vendors" ? (
          <div>
            <h5 className="fw-semibold mb-3">Select Vendors</h5>
            <ListGroup>
              {vendors.length === 0 ? (
                <Alert color="info">No vendors available.</Alert>
              ) : (
                vendors.map((vendor, index) => (
                  <ListGroupItem
                    key={vendor.vendorId || `vendor-${index}`}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <p className="mb-1 fw-semibold text-primary">
                        {vendor.vendorName || "Unnamed Vendor"}
                      </p>
                      <p className="mb-1 small">
                        <strong>Price:</strong> ₹
                        {vendor.price?.toFixed(2) || "N/A"}
                      </p>
                      <p className="mb-0 small">
                        <strong>Specialties:</strong>{" "}
                        {vendor.vendorSpecialties?.length > 0
                          ? vendor.vendorSpecialties.join(", ")
                          : "None"}
                      </p>
                    </div>
                    <Button
                      color={
                        selectedVendors.some((v) => v.vendorId === vendor.vendorId)
                          ? "danger"
                          : "success"
                      }
                      size="sm"
                      onClick={() => handleSelectVendor(vendor)}
                    >
                      {selectedVendors.some((v) => v.vendorId === vendor.vendorId)
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
            <h5 className="fw-semibold mb-3">Confirm Booking Details</h5>
            <FormGroup>
              <Label for="bookingDate" className="fw-semibold">
                Booking Date
              </Label>
              <Input
                type="date"
                id="bookingDate"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]} // Prevent past dates
              />
              {dateError && <Alert color="danger" className="mt-2">{dateError}</Alert>}
            </FormGroup>
            <h6 className="mt-3">Selected Carters:</h6>
            <ListGroup className="mb-3">
              {selectedCarters.length === 0 ? (
                <ListGroupItem>No carters selected.</ListGroupItem>
              ) : (
                selectedCarters.map((carter) => (
                  <ListGroupItem key={carter.carterId}>
                    {carter.carterName} (₹{carter.price?.toFixed(2) || "N/A"})
                  </ListGroupItem>
                ))
              )}
            </ListGroup>
            <h6>Selected Vendors:</h6>
            <ListGroup className="mb-3">
              {selectedVendors.length === 0 ? (
                <ListGroupItem>No vendors selected.</ListGroupItem>
              ) : (
                selectedVendors.map((vendor) => (
                  <ListGroupItem key={vendor.vendorId}>
                    {vendor.vendorName} (₹{vendor.price?.toFixed(2) || "N/A"})
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
        {stage === "confirm" && (
          <Button color="secondary" onClick={() => setStage("vendors")}>
            Previous
          </Button>
        )}
        {stage === "carters" ? (
          <Button color="primary" onClick={() => setStage("vendors")}>
            Next
          </Button>
        ) : stage === "vendors" ? (
          <Button color="primary" onClick={() => setStage("confirm")}>
            Next
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={handleConfirmBooking}
            disabled={loading || !!dateError}
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