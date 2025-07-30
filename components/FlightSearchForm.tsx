
'use client';

import { useState } from 'react';

export default function FlightSearchForm() {
  const [tripType, setTripType] = useState('round-trip');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [validationError, setValidationError] = useState('');

  const mockFlights = [
    {
      id: 1,
      airline: 'SkySwift Airlines',
      flightNumber: 'SW 2451',
      departure: '08:30 AM',
      arrival: '11:45 AM',
      duration: '3h 15m',
      basePrice: 299,
      taxes: 45,
      fees: 25,
      totalPrice: 369,
      stops: 'Non-stop',
      aircraft: 'Boeing 737-800',
      baggage: {
        carry: 'Included',
        checked: '$35 first bag'
      },
      amenities: ['Wi-Fi', 'Power outlets', 'Snacks'],
      cancellation: 'Free cancellation within 24h',
      seatSelection: 'From $15',
      refundable: true,
      availableSeats: 12
    },
    {
      id: 2,
      airline: 'CloudJet',
      flightNumber: 'CJ 1847',
      departure: '02:15 PM',
      arrival: '05:30 PM',
      duration: '3h 15m',
      basePrice: 249,
      taxes: 38,
      fees: 20,
      totalPrice: 307,
      stops: 'Non-stop',
      aircraft: 'Airbus A320',
      baggage: {
        carry: 'Included',
        checked: '$40 first bag'
      },
      amenities: ['Wi-Fi', 'Entertainment', 'Beverage'],
      cancellation: 'Free cancellation within 24h',
      seatSelection: 'From $12',
      refundable: false,
      availableSeats: 8
    },
    {
      id: 3,
      airline: 'AirVelocity',
      flightNumber: 'AV 9623',
      departure: '06:45 PM',
      arrival: '10:00 PM',
      duration: '3h 15m',
      basePrice: 189,
      taxes: 32,
      fees: 18,
      totalPrice: 239,
      stops: 'Non-stop',
      aircraft: 'Boeing 737-700',
      baggage: {
        carry: 'Included',
        checked: '$45 first bag'
      },
      amenities: ['Wi-Fi', 'Snacks'],
      cancellation: 'No free cancellation',
      seatSelection: 'From $10',
      refundable: false,
      availableSeats: 5
    },
    {
      id: 4,
      airline: 'Premium Airways',
      flightNumber: 'PA 5501',
      departure: '11:20 AM',
      arrival: '02:35 PM',
      duration: '3h 15m',
      basePrice: 459,
      taxes: 68,
      fees: 30,
      totalPrice: 557,
      stops: 'Non-stop',
      aircraft: 'Boeing 787-9',
      baggage: {
        carry: 'Included',
        checked: 'First bag included'
      },
      amenities: ['Wi-Fi', 'Premium meals', 'Entertainment', 'Extra legroom'],
      cancellation: 'Free cancellation within 48h',
      seatSelection: 'Complimentary',
      refundable: true,
      availableSeats: 15
    },
    {
      id: 5,
      airline: 'Budget Air',
      flightNumber: 'BA 7739',
      departure: '05:45 AM',
      arrival: '09:00 AM',
      duration: '3h 15m',
      basePrice: 149,
      taxes: 28,
      fees: 15,
      totalPrice: 192,
      stops: 'Non-stop',
      aircraft: 'Airbus A319',
      baggage: {
        carry: 'Included (small bag)',
        checked: '$50 first bag'
      },
      amenities: ['Basic seat'],
      cancellation: 'No free cancellation',
      seatSelection: 'From $8',
      refundable: false,
      availableSeats: 3
    }
  ];

  const handleSearch = () => {
    setValidationError('');
    
    // Validate required fields
    if (!fromCity.trim()) {
      setValidationError('Please enter departure city');
      return;
    }
    if (!toCity.trim()) {
      setValidationError('Please enter destination city');
      return;
    }
    if (!departDate) {
      setValidationError('Please select departure date');
      return;
    }
    if (tripType === 'round-trip' && !returnDate) {
      setValidationError('Please select return date');
      return;
    }
    
    // Check if return date is after departure date
    if (tripType === 'round-trip' && returnDate && departDate) {
      if (new Date(returnDate) <= new Date(departDate)) {
        setValidationError('Return date must be after departure date');
        return;
      }
    }
    
    // Check if departure date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(departDate) < today) {
      setValidationError('Departure date cannot be in the past');
      return;
    }
    
    setShowSearchResults(true);
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    setShowFlightDetails(true);
  };

  const handleBookFlight = () => {
    alert(`Booking confirmed for ${selectedFlight.airline} flight ${selectedFlight.flightNumber}. Total: $${selectedFlight.totalPrice * passengers}`);
    setShowFlightDetails(false);
    setShowSearchResults(false);
  };

  return (
    <>
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => setTripType('round-trip')}
            className={`px-3 sm:px-4 md:px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer text-sm sm:text-base ${tripType === 'round-trip' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Round Trip
          </button>
          <button
            onClick={() => setTripType('one-way')}
            className={`px-3 sm:px-4 md:px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer text-sm sm:text-base ${tripType === 'one-way' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            One Way
          </button>
          <button
            onClick={() => setTripType('multi-city')}
            className={`px-3 sm:px-4 md:px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer text-sm sm:text-base ${tripType === 'multi-city' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            Multi City
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
            <div className="relative">
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                placeholder="New York (NYC)"
                className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white placeholder-gray-400"
              />
              <i className="ri-flight-takeoff-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
            <div className="relative">
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                placeholder="Los Angeles (LAX)"
                className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white placeholder-gray-400"
              />
              <i className="ri-flight-land-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Departure</label>
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white"
            />
          </div>

          {tripType === 'round-trip' && (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm text-white"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Passengers</label>
            <button
              onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
              className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-left text-sm cursor-pointer hover:bg-gray-700 transition-colors text-white"
            >
              <div className="flex items-center justify-between">
                <span>{passengers} Passenger{passengers > 1 ? 's' : ''}</span>
                <i className="ri-user-line text-gray-400"></i>
              </div>
              <i className="ri-arrow-down-s-line float-right text-gray-400 text-lg -mt-6"></i>
            </button>
            {showPassengerDropdown && (
              <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 mt-1">
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Adults</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <i className="ri-subtract-line text-white text-sm"></i>
                      </button>
                      <span className="text-white min-w-[20px] text-center">{passengers}</span>
                      <button
                        onClick={() => setPassengers(Math.min(9, passengers + 1))}
                        className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <i className="ri-add-line text-white text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <button
                    onClick={() => setShowPassengerDropdown(false)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Class</label>
            <button
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="w-full p-3 sm:p-4 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-left text-sm cursor-pointer hover:bg-gray-700 transition-colors text-white capitalize"
            >
              <div className="flex items-center justify-between">
                <span>{cabinClass}</span>
                <i className="ri-vip-crown-line text-gray-400"></i>
              </div>
              <i className="ri-arrow-down-s-line float-right text-gray-400 text-lg -mt-6"></i>
            </button>
            {showClassDropdown && (
              <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 mt-1">
                {[{ value: 'economy', label: 'Economy', icon: 'ri-user-line' }, { value: 'premium economy', label: 'Premium Economy', icon: 'ri-user-star-line' }, { value: 'business', label: 'Business', icon: 'ri-vip-line' }, { value: 'first', label: 'First Class', icon: 'ri-vip-crown-line' }].map((cls) => (
                  <button
                    key={cls.value}
                    onClick={() => {
                      setCabinClass(cls.value);
                      setShowClassDropdown(false);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-700 transition-colors cursor-pointer text-sm text-white flex items-center gap-3"
                  >
                    <i className={`${cls.icon} text-gray-400`}></i>
                    {cls.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {validationError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <div className="flex items-center gap-2">
              <i className="ri-error-warning-line text-red-400"></i>
              <span className="text-red-400 text-sm">{validationError}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold text-base sm:text-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer shadow-lg"
        >
          <i className="ri-search-line mr-2"></i>
          Search Flights
        </button>
      </div>

      {/* Search Results Modal */}
      {showSearchResults && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Flight Search Results</h2>
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-300">
                  {fromCity} → {toCity} • {departDate} {tripType === 'round-trip' && returnDate && `• ${returnDate}`} • {passengers} Passenger{passengers > 1 ? 's' : ''} • {cabinClass}
                </p>
              </div>

              <div className="space-y-4">
                {mockFlights.map((flight) => (
                  <div key={flight.id} className="bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-750 transition-colors">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                              <i className="ri-flight-takeoff-line text-white text-lg"></i>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">{flight.airline}</h3>
                              <p className="text-gray-400 text-sm">{flight.flightNumber} • {flight.aircraft}</p>
                            </div>
                            <div className="ml-auto">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${flight.availableSeats <= 5 ? 'bg-red-500/20 text-red-400' : flight.availableSeats <= 10 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                {flight.availableSeats} seats left
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-8 text-white mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{flight.departure}</div>
                              <div className="text-sm text-gray-400">{fromCity}</div>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm text-gray-400 mb-1">{flight.duration}</div>
                                <div className="w-20 h-px bg-gray-600 relative">
                                  <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{flight.stops}</div>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-2xl font-bold">{flight.arrival}</div>
                              <div className="text-sm text-gray-400">{toCity}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <i className="ri-suitcase-line text-gray-400"></i>
                              <span className="text-gray-300">Carry-on: {flight.baggage.carry}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <i className="ri-checkbox-circle-line text-gray-400"></i>
                              <span className="text-gray-300">Checked: {flight.baggage.checked}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <i className="ri-wifi-line text-gray-400"></i>
                              <span className="text-gray-300">{flight.amenities.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white">${flight.totalPrice}</div>
                            <div className="text-sm text-gray-400">per person</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Base: ${flight.basePrice} + Tax: ${flight.taxes} + Fees: ${flight.fees}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {flight.refundable && (
                                <span className="text-green-400 text-xs flex items-center gap-1">
                                  <i className="ri-shield-check-line"></i>
                                  Refundable
                                </span>
                              )}
                              <span className="text-gray-400 text-xs">{flight.cancellation}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleFlightSelect(flight)}
                              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap"
                            >
                              Select Flight
                            </button>
                            <button className="text-cyan-400 hover:text-cyan-300 text-sm cursor-pointer whitespace-nowrap">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-white font-semibold mb-3">Price Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">${Math.min(...mockFlights.map((f) => f.totalPrice))}</div>
                    <div className="text-gray-400">Lowest Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">${Math.round(mockFlights.reduce((sum, f) => sum + f.totalPrice, 0) / mockFlights.length)}</div>
                    <div className="text-gray-400">Average Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{mockFlights.filter((f) => f.refundable).length}</div>
                    <div className="text-gray-400">Refundable Options</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h3 className="text-white font-semibold mb-3">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <strong>Included in all fares:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Personal item</li>
                      <li>Seat selection (basic)</li>
                      <li>Online check-in</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Optional add-ons:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Priority boarding: $20</li>
                      <li>Extra legroom: $35-50</li>
                      <li>Travel insurance: $25</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Details Modal */}
      {showFlightDetails && selectedFlight && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Flight Details</h2>
              <button
                onClick={() => setShowFlightDetails(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">{selectedFlight.airline}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Flight Number:</span>
                    <span className="text-white ml-2">{selectedFlight.flightNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Aircraft:</span>
                    <span className="text-white ml-2">{selectedFlight.aircraft}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base Fare ({passengers} passenger{passengers > 1 ? 's' : ''})</span>
                    <span className="text-white">${selectedFlight.basePrice * passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Taxes & Fees</span>
                    <span className="text-white">${(selectedFlight.taxes + selectedFlight.fees) * passengers}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-white text-lg">${selectedFlight.totalPrice * passengers}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Baggage & Amenities</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Carry-on:</span>
                    <span className="text-white ml-2">{selectedFlight.baggage.carry}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Checked bag:</span>
                    <span className="text-white ml-2">{selectedFlight.baggage.checked}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Seat selection:</span>
                    <span className="text-white ml-2">{selectedFlight.seatSelection}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Amenities:</span>
                    <span className="text-white ml-2">{selectedFlight.amenities.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Policies</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <i className={`ri-${selectedFlight.refundable ? 'checkbox-circle-fill text-green-400' : 'close-circle-fill text-red-400'}`}></i>
                    <span className="text-gray-300">
                      {selectedFlight.refundable ? 'Refundable fare' : 'Non-refundable fare'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-information-line text-blue-400"></i>
                    <span className="text-gray-300">{selectedFlight.cancellation}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookFlight}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all cursor-pointer whitespace-nowrap"
              >
                Book This Flight - ${selectedFlight.totalPrice * passengers}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}