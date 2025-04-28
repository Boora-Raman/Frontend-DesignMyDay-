import React, { useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";

const AddVenueForm = ({ onVenueAdded }) => {
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venuePrice, setVenuePrice] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("Please log in to add a venue.");
      }
      const decoded = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const userId = decoded.sub;

      const formData = new FormData();
      formData.append(
        "venue",
        new Blob(
          [
            JSON.stringify({
              venueName,
              venueAddress,
              venuePrice: parseFloat(venuePrice),
            }),
          ],
          { type: "application/json" }
        )
      );
      images.forEach((image) => formData.append("images", image));

      await axios.post(`http://localhost:8085/venues`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setVenueName("");
      setVenueAddress("");
      setVenuePrice("");
      setImages([]);
      setError("");
      toast.success("Venue added successfully!");
      onVenueAdded();
    } catch (error) {
      console.error("Error adding venue:", error);
      setError(error.response?.data || "Failed to add venue.");
      toast.error(error.response?.data || "Failed to add venue.");
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <Container className="py-5">
      <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>
        <Card className="mx-auto" style={{ maxWidth: "600px" }}>
          <CardBody className="p-5">
            <CardTitle tag="h3" className="text-center text-primary fw-bold mb-4">
              Add New Venue
            </CardTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="venueName" className="fw-semibold">Venue Name</Label>
                <Input
                  type="text"
                  id="venueName"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="Enter venue name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="venueAddress" className="fw-semibold">Address</Label>
                <Input
                  type="text"
                  id="venueAddress"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Enter venue address"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="venuePrice" className="fw-semibold">Price (₹)</Label>
                <Input
                  type="number"
                  id="venuePrice"
                  value={venuePrice}
                  onChange={(e) => setVenuePrice(e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="images" className="fw-semibold">Images</Label>
                <Input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormGroup>
              {error && <Alert color="danger">{error}</Alert>}
              <Button color="primary" block className="mt-3">
                Add Venue
              </Button>
            </Form>
          </CardBody>
        </Card>
      </CSSTransition>
    </Container>
  );
};

export default AddVenueForm;