"use client";
import React, { useEffect, useState } from "react";
import { getUpcomingEvents } from "@/utils/FirebaseFunctions"; // Assuming this fetches event data including image URL
import { CalendarDays, MapPin, Link2 } from "lucide-react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const UpcomingEventsSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null); // State to track expanded event

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const events = await getUpcomingEvents();
        setUpcomingEvents(events);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-orange-600 mb-6">
            Upcoming Events
          </h2>
          <p className="text-center text-orange-400">Loading upcoming events...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-orange-600 mb-6">
            Upcoming Events
          </h2>
          <p className="text-center text-red-500">
            Error loading events: {error.message}
          </p>
        </div>
      </section>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-orange-600 mb-6">
            Upcoming Events
          </h2>
          <p className="text-center text-orange-400">The Event is still in the Oven</p>
        </div>
      </section>
    );
  }

  return (
    <section id="upcoming-events" className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
    
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-orange-600 mb-12">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <React.Fragment key={event.id}>
              <div
                className={`bg-white rounded-3xl shadow-xl p-6 flex flex-col transition-transform hover:scale-[1.02] border border-orange-100 ${
                  expandedEventId === event.id ? "hidden" : ""
                }`}
              >
                {event.mediaPath && (
                  <img
                    src={event.mediaPath}
                    alt={event.title}
                    className="mb-4 rounded-xl object-cover w-full h-48 shadow-sm"
                  />
                )}
                <h3 className="text-2xl font-bold mb-3 text-orange-600">
                  {event.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <CalendarDays className="w-5 h-5 mr-2 text-orange-400" />
                  <span>{formatDate(event.date)}</span>
                </div>

                <button
                  onClick={() => setExpandedEventId(event.id)}
                  className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow hover:shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
                >
                  View More Details
                </button>
              </div>

              {expandedEventId === event.id && (
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-orange-100 col-span-1 sm:col-span-2 lg:col-span-3">
                  <div className="flex flex-col md:flex-row items-start">
                    {event.mediaPath && (
                      <img
                        src={event.mediaPath}
                        alt={event.title}
                        className="mb-6 md:mb-0 md:mr-6 rounded-xl object-cover w-full md:w-1/3 h-64 shadow-sm"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-3xl font-bold text-orange-600">
                          {event.title}
                        </h3>
                        <button
                          onClick={() => setExpandedEventId(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Close
                        </button>
                      </div>

                      <div className="flex items-center text-base text-gray-600 mb-3">
                        <CalendarDays className="w-5 h-5 mr-2 text-orange-400" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      {event.mode === "Offline" && event.venue && (
                        <div className="flex items-center text-base text-gray-600 mb-3">
                          <MapPin className="w-5 h-5 mr-2 text-orange-400" />
                          <span>{event.venue}</span>
                        </div>
                      )}

                      <p className="text-gray-700 mb-6">{event.description}</p>

                      {event.needReg === "True" && event.regLink && (
                        <a href={event.regLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold shadow hover:shadow-lg hover:from-orange-600 hover:to-yellow-600 transition-all mb-3 mr-3">
                          Register Here
                        </a>
                      )}

                      {event.mode === "Online" && event.meetlink && (
                        <a
                          href={event.meetlink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition-all"
                        >
                          <Link2 className="w-5 h-5 mr-2" />
                          Join Meet
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
