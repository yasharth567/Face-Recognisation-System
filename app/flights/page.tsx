'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FlightSearchForm from '@/components/FlightSearchForm';

export default function FlightsPage() {
  const [activeTab, setActiveTab] = useState('search');

  const featuredFlights = [
    {
      id: 1,
      from: 'New York',
      to: 'London',
      fromCode: 'NYC',
      toCode: 'LHR',
      price: 679,
      originalPrice: 799,
      airline: 'British Airways',
      duration: '7h 30m',
      date: '2024-12-25',
      image: 'https://readdy.ai/api/search-image?query=London%20Big%20Ben%20and%20Parliament%20buildings%20at%20night%20with%20dramatic%20dark%20sky%2C%20warm%20golden%20lights%20illuminating%20British%20architecture%2C%20moody%20evening%20atmosphere%20with%20River%20Thames%20reflecting%20city%20lights%2C%20cinematic%20UK%20landmark%20photography%20with%20mysterious%20dark%20background%20perfect%20for%20travel%20website&width=400&height=240&seq=london-flight-deal&orientation=landscape'
    },
    {
      id: 2,
      from: 'Los Angeles',
      to: 'Tokyo',
      fromCode: 'LAX',
      toCode: 'NRT',
      price: 899,
      originalPrice: 1099,
      airline: 'Japan Airlines',
      duration: '11h 45m',
      date: '2024-12-28',
      image: 'https://readdy.ai/api/search-image?query=Tokyo%20cityscape%20at%20night%20with%20neon%20lights%20and%20modern%20skyscrapers%20illuminated%20against%20dark%20sky%2C%20vibrant%20city%20lights%20creating%20dramatic%20urban%20atmosphere%2C%20cinematic%20night%20photography%20of%20Japanese%20metropolis%20with%20futuristic%20architecture%20and%20glowing%20signs&width=400&height=240&seq=tokyo-flight-deal&orientation=landscape'
    },
    {
      id: 3,
      from: 'Miami',
      to: 'Paris',
      fromCode: 'MIA',
      toCode: 'CDG',
      price: 749,
      originalPrice: 899,
      airline: 'Air France',
      duration: '8h 15m',
      date: '2024-12-30',
      image: 'https://readdy.ai/api/search-image?query=Paris%20Eiffel%20Tower%20illuminated%20at%20night%20with%20dark%20dramatic%20sky%2C%20romantic%20city%20lights%20reflecting%20on%20Seine%20river%2C%20moody%20evening%20atmosphere%20with%20golden%20tower%20lights%20against%20deep%20blue%20twilight%2C%20cinematic%20French%20architecture%20photography&width=400&height=240&seq=paris-flight-deal&orientation=landscape'
    },
    {
      id: 4,
      from: 'Chicago',
      to: 'Dubai',
      fromCode: 'ORD',
      toCode: 'DXB',
      price: 1299,
      originalPrice: 1499,
      airline: 'Emirates',
      duration: '13h 20m',
      date: '2025-01-05',
      image: 'https://readdy.ai/api/search-image?query=Dubai%20skyline%20at%20night%20with%20Burj%20Khalifa%20and%20modern%20skyscrapers%20illuminated%20against%20dark%20desert%20sky%2C%20luxurious%20city%20lights%20creating%20dramatic%20Middle%20Eastern%20atmosphere%2C%20futuristic%20architecture%20with%20golden%20lights%20reflecting%20in%20dark%20waters&width=400&height=240&seq=dubai-flight-deal&orientation=landscape'
    },
    {
      id: 5,
      from: 'San Francisco',
      to: 'Sydney',
      fromCode: 'SFO',
      toCode: 'SYD',
      price: 1199,
      originalPrice: 1399,
      airline: 'Qantas',
      duration: '14h 40m',
      date: '2025-01-10',
      image: 'https://readdy.ai/api/search-image?query=Sydney%20Opera%20House%20and%20Harbour%20Bridge%20illuminated%20at%20night%20with%20dramatic%20dark%20sky%2C%20iconic%20Australian%20landmarks%20with%20golden%20lights%20reflecting%20in%20dark%20harbor%20waters%2C%20moody%20evening%20atmosphere%20with%20city%20lights%20creating%20cinematic%20ambiance&width=400&height=240&seq=sydney-flight-deal&orientation=landscape'
    },
    {
      id: 6,
      from: 'Boston',
      to: 'Amsterdam',
      fromCode: 'BOS',
      toCode: 'AMS',
      price: 599,
      originalPrice: 749,
      airline: 'KLM',
      duration: '6h 55m',
      date: '2025-01-15',
      image: 'https://readdy.ai/api/search-image?query=Amsterdam%20canals%20at%20night%20with%20historic%20buildings%20illuminated%20and%20reflections%20in%20dark%20water%2C%20charming%20Dutch%20architecture%20with%20warm%20golden%20lights%2C%20moody%20evening%20atmosphere%20with%20traditional%20canal%20houses%20and%20bridges%2C%20cinematic%20European%20city%20photography&width=400&height=240&seq=amsterdam-flight-deal&orientation=landscape'
    }
  ];

  const airlines = [
    { name: 'American Airlines', logo: 'ri-flight-takeoff-fill', deals: 45 },
    { name: 'Delta Air Lines', logo: 'ri-flight-takeoff-fill', deals: 38 },
    { name: 'United Airlines', logo: 'ri-flight-takeoff-fill', deals: 52 },
    { name: 'British Airways', logo: 'ri-flight-takeoff-fill', deals: 29 },
    { name: 'Emirates', logo: 'ri-flight-takeoff-fill', deals: 31 },
    { name: 'Lufthansa', logo: 'ri-flight-takeoff-fill', deals: 42 },
    { name: 'Singapore Airlines', logo: 'ri-flight-takeoff-fill', deals: 26 },
    { name: 'Air France', logo: 'ri-flight-takeoff-fill', deals: 34 }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="pt-16 sm:pt-20">
        <div 
          className="relative h-80 sm:h-96 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Commercial%20airplane%20flying%20through%20dramatic%20dark%20storm%20clouds%20at%20night%2C%20powerful%20aircraft%20silhouette%20against%20moody%20sky%20with%20lightning%20illuminating%20dramatic%20cloudscape%2C%20cinematic%20aviation%20photography%20with%20deep%20purple%20and%20dark%20blue%20atmospheric%20tones%2C%20mysterious%20flight%20journey%20with%20sense%20of%20adventure&width=1920&height=600&seq=flights-page-hero&orientation=landscape')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-purple-900/80" />
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  Find Your Perfect 
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent block">
                    Flight
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
                  Search, compare, and book flights from over 500 airlines worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <FlightSearchForm />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Search Flights
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'deals'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Flight Deals
            </button>
            <button
              onClick={() => setActiveTab('airlines')}
              className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'airlines'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Airlines
            </button>
          </div>

          {activeTab === 'deals' && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                Featured Flight Deals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredFlights.map((flight) => (
                  <div key={flight.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={flight.image}
                        alt={`${flight.from} to ${flight.to}`}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Save ${flight.originalPrice - flight.price}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {flight.from} → {flight.to}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {flight.fromCode} to {flight.toCode}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">${flight.price}</div>
                          <div className="text-gray-400 line-through text-sm">${flight.originalPrice}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                            <i className="ri-flight-takeoff-fill text-white text-sm"></i>
                          </div>
                          <span className="text-gray-300 text-sm">{flight.airline}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{flight.duration}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{flight.date}</span>
                        <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'airlines' && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                Partner Airlines
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {airlines.map((airline, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className={`${airline.logo} text-white text-2xl`}></i>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{airline.name}</h3>
                      <p className="text-gray-400 text-sm">{airline.deals} active deals</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
                Search Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                    <i className="ri-calendar-line text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Book in Advance</h3>
                  <p className="text-gray-300">Book your flights 2-3 months ahead for domestic travel and 3-6 months for international flights to get the best deals.</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <i className="ri-time-line text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Flexible Dates</h3>
                  <p className="text-gray-300">Use our flexible date search to find the cheapest days to fly. Mid-week flights are often less expensive.</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                    <i className="ri-notification-line text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Price Alerts</h3>
                  <p className="text-gray-300">Set up price alerts for your favorite destinations and get notified when prices drop.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}