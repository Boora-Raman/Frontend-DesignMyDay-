import React, { useState, useRef } from "react";
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

const AddVendorForm = ({ onVendorAdded }) => {
  const [vendorName, setVendorName] = useState("");
  const [vendorContact, setVendorContact] = useState("");
  const [vendorSpecialties, setVendorSpecialties] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // New state for price
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("jwt");
      if (!token) {
        throw new Error("Please log in to add a vendor.");
      }

      const specialtiesArray = vendorSpecialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const formData = new FormData();
      formData.append(
        "vendor",
        new Blob(
          [
            JSON.stringify({
              vendorName,
              vendorSpecialties: specialtiesArray,
              description,
              price: price ? parseFloat(price) : null, // Convert to number
            }),
          ],
          { type: "application/json" }
        )
      );

      images.forEach((image) => formData.append("images", image));

      const response = await axios.post("http://localhost:8085/vendors", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setVendorName("");
      setVendorContact("");
      setVendorSpecialties("");
      setDescription("");
      setPrice("");
      setImages([]);
      setImagePreviews([]);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Vendor added successfully!");
      onVendorAdded();
    } catch (error) {
      console.error("Error adding vendor:", error);
      const errorMessage =
        error.response?.data ||
        error.message ||
        "Failed to add vendor. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <Container className="py-5">
      <CSSTransition in={true} timeout={300} classNames="fade" unmountOnExit>
        <Card className="mx-auto" style={{ maxWidth: "600px" }}>
          <CardBody className="p-5">
            <CardTitle tag="h3" className="text-center text-primary fw-bold mb-4">
              Add New Vendor
            </CardTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="vendorName" className="fw-semibold">Vendor Name</Label>
                <Input
                  type="text"
                  id="vendorName"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Enter vendor name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="vendorContact" className="fw-semibold">Contact</Label>
                <Input
                  type="text"
                  id="vendorContact"
                  value={vendorContact}
                  onChange={(e) => setVendorContact(e.target.value)}
                  placeholder="Enter vendor contact"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="vendorSpecialties" className="fw-semibold">Specialties</Label>
                <Input
                  type="text"
                  id="vendorSpecialties"
                  value={vendorSpecialties}
                  onChange={(e) => setVendorSpecialties(e.target.value)}
                  placeholder="Enter specialties (e.g., Decorator, Designer, Photographer)"
                />
                <small className="text-muted">Separate specialties with commas.</small>
              </FormGroup>
              <FormGroup>
                <Label for="description" className="fw-semibold">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a description of the vendor"
                  rows="5"
                />
              </FormGroup>
              <FormGroup>
                <Label for="price" className="fw-semibold">Price (₹)</Label>
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter vendor price"
                  min="0"
                  step="0.01"
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
                  innerRef={fileInputRef}
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-3">
                    {imagePreviews.map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                      />
                    ))}
                  </div>
                )}
              </FormGroup>
              {error && <Alert color="danger">{error}</Alert>}
              <Button color="primary" block className="mt-3">
                Add Vendor
              </Button>
            </Form>
          </CardBody>
        </Card>
      </CSSTransition>
    </Container>
  );
};

export default AddVendorForm;