import React, { useState } from 'react';
import axios from 'axios';

const AddVenueForm = () => {
  const [venueData, setVenueData] = useState({
    venueName: '',
    venueAddress: '',
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const selectedImages = [...e.target.files];
    console.log('Selected images:', selectedImages.map(img => ({ name: img.name, size: img.size })));
    setImages(selectedImages);
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Client-side validation
    if (!venueData.venueName.trim()) {
      setError('Venue name is required.');
      return;
    }
    if (!venueData.venueAddress.trim()) {
      setError('Venue address is required.');
      return;
    }

    try {
      const formData = new FormData();
      // Append venue data
      formData.append('venue', new Blob([JSON.stringify({
        venueName: venueData.venueName,
        venueAddress: venueData.venueAddress,
      })], { type: 'application/json' }));

      // Append images (optional)
      images.forEach((image, index) => {
        formData.append('images', image);
        console.log(`Appending image ${index + 1}: ${image.name}`);
      });

      const token = sessionStorage.getItem('jwt');
      if (!token) {
        setError('You must be logged in to add a venue.');
        return;
      }

      const response = await axios.post('http://localhost:8085/venues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Venue creation response:', response.data);
      setMessage(response.data);
      setVenueData({ venueName: '', venueAddress: '' });
      setImages([]);
      document.getElementById('images').value = ''; // Reset file input
    } catch (error) {
      console.error('Error adding venue:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Failed to add venue.');
      } else {
        setError('Failed to add venue. Please check your network or try again.');
      }
    }
  };

  return (
    <div className="add-venue-form container mx-auto p-6 max-w-lg bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Venue</h2>
      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="venueName" className="block text-sm font-medium text-gray-700">Venue Name</label>
          <input
            type="text"
            id="venueName"
            name="venueName"
            placeholder="Enter venue name"
            value={venueData.venueName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-700">Venue Address</label>
          <textarea
            id="venueAddress"
            name="venueAddress"
            placeholder="Enter full address (e.g., 123 Main St, City, State, ZIP)"
            value={venueData.venueAddress}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Upload Images (Optional, JPEG/PNG, max 5MB)</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Venue
        </button>
      </form>
    </div>
  );
};

export default AddVenueForm;