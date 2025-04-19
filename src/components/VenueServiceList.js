import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const VenueServiceList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const token = sessionStorage.getItem('jwt');
      if (!token) {
        throw new Error('You must be logged in to view venues.');
      }

      const response = await axios.get("http://localhost:8085/venues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetched venues:', response.data);
      setVenues(response.data);
      setError('');
    } catch (error) {
      console.error("Error fetching venues:", error);
      setError(error.message || "Error fetching venues. Please check your authentication or try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading venues...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Venues and Services
      </h1>

      {venues.length === 0 && (
        <p className="text-gray-500">No venues available.</p>
      )}

      {venues.map((venue) => (
        <div
          key={venue.venueId}
          className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Carousel Section */}
            <div className="w-full lg:w-1/2">
              <Swiper
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="rounded-xl overflow-hidden"
              >
                {venue.images && venue.images.length > 0 ? (
                  venue.images.map((img, idx) => (
                    <SwiperSlide key={img.imgid || idx}>
                      <img
                        src={`http://localhost:8085/api/images/${img.imgName}`}
                        alt={`${venue.venueName} ${idx + 1}`}
                        className="h-64 w-full object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image: ${img.imgName}`);
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <img
                      src="https://via.placeholder.com/400x300?text=No+Image"
                      alt="Placeholder for venue"
                      className="h-64 w-full object-cover"
                    />
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Venue Info Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-800 mb-2">
                  {venue.venueName}
                </h2>
                <p className="text-gray-600 mb-1">
                  <strong>Venue ID:</strong> {venue.venueId}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Address:</strong> {venue.venueAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Services Card */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Services Offered:
            </h3>
            {venue.services && venue.services.length > 0 ? (
              <ul className="space-y-3">
                {venue.services.map((service) => (
                  <li
                    key={service.serviceId}
                    className="border-b pb-2 border-gray-200"
                  >
                    <p className="font-medium text-blue-700">{service.serviceName}</p>
                    <p className="text-gray-600 text-sm">
                      <strong>Price:</strong> ₹{service.servicePrice.toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Description:</strong>{" "}
                      {service.serviceDescription || "No description provided"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No services listed for this venue.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VenueServiceList;