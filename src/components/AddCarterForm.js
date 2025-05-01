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

const AddCarterForm = ({ onCarterAdded }) => {
  const [carterName, setCarterName] = useState("");
  const [carterContact, setCarterContact] = useState("");
  const [carterSpecialties, setCarterSpecialties] = useState("");
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
        throw new Error("Please log in to add a carter.");
      }

      const specialtiesArray = carterSpecialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      const formData = new FormData();
      formData.append(
        "carter",
        new Blob(
          [
            JSON.stringify({
              carterName,
              carterContact,
              carterSpecialties: specialtiesArray,
              description,
              price: price ? parseFloat(price) : null, // Convert to number
            }),
          ],
          { type: "application/json" }
        )
      );

      images.forEach((image) => formData.append("images", image));

      const response = await axios.post("http://13.53.163.51:8085/carters", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setCarterName("");
      setCarterContact("");
      setCarterSpecialties("");
      setDescription("");
      setPrice("");
      setImages([]);
      setImagePreviews([]);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Carter added successfully!");
      onCarterAdded();
    } catch (error) {
      console.error("Error adding carter:", error);
      const errorMessage =
        error.response?.data ||
        error.message ||
        "Failed to add carter. Please try again.";
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
              Add New Carter
            </CardTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="carterName" className="fw-semibold">Carter Name</Label>
                <Input
                  type="text"
                  id="carterName"
                  value={carterName}
                  onChange={(e) => setCarterName(e.target.value)}
                  placeholder="Enter carter name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="carterContact" className="fw-semibold">Contact</Label>
                <Input
                  type="text"
                  id="carterContact"
                  value={carterContact}
                  onChange={(e) => setCarterContact(e.target.value)}
                  placeholder="Enter carter contact"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="carterSpecialties" className="fw-semibold">Specialties</Label>
                <Input
                  type="text"
                  id="carterSpecialties"
                  value={carterSpecialties}
                  onChange={(e) => setCarterSpecialties(e.target.value)}
                  placeholder="Enter specialties (e.g., Signature Biryani, Craft Cocktails)"
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
                  placeholder="Enter a description of the carter"
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
                  placeholder="Enter carter price"
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
                Add Carter
              </Button>
            </Form>
          </CardBody>
        </Card>
      </CSSTransition>
    </Container>
  );
};

export default AddCarterForm;