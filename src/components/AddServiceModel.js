import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddServiceModal = ({ venueId, onClose, onServicesAdded }) => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const token = sessionStorage.getItem('jwt');
      const response = await axios.get('http://localhost:8085/services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
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
      const token = sessionStorage.getItem('jwt');
      await axios.post(
        `http://localhost:8085/venues/${venueId}/services`,
        selectedServices,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success("Services added successfully!");
      onServicesAdded();
      onClose();
    } catch (error) {
      console.error('Error adding services:', error);
      setError('Failed to add services. Please try again.');
      toast.error('Failed to add services.');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Services</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-gray-700 text-center font-medium">Loading services...</div>
        ) : error ? (
          <div className="text-red-600 text-center font-medium">{error}</div>
        ) : (
          <div className="space-y-6">
            {services.length === 0 ? (
              <p className="text-gray-600 text-center font-medium">No services available.</p>
            ) : (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {services.map((service) => (
                  <li
                    key={service.serviceId}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.serviceId)}
                      onChange={() => handleServiceToggle(service.serviceId)}
                      className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-gray-900 font-semibold">{service.serviceName}</p>
                      <p className="text-gray-600 text-sm">₹{service.servicePrice.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selectedServices.length === 0}
                className={`px-5 py-2 rounded-full text-white font-semibold ${
                  selectedServices.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddServiceModal;