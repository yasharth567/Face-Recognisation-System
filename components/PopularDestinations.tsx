
'use client';

import { useEffect, useState } from 'react';

export default function PopularDestinations() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const destinations = [
    {
      city: 'Tokyo',
      country: 'Japan',
      price: 'From $899',
      image: 'https://readdy.ai/api/search-image?query=Tokyo%20cityscape%20at%20night%20with%20neon%20lights%20reflecting%20in%20dark%20waters%2C%20modern%20skyscrapers%20illuminated%20against%20dark%20sky%2C%20vibrant%20city%20lights%20creating%20dramatic%20urban%20atmosphere%2C%20cinematic%20night%20photography%20of%20Japanese%20metropolis%20with%20futuristic%20architecture%20and%20glowing%20signs%2C%20moody%20dark%20background%20perfect%20for%20travel%20website&width=400&height=300&seq=tokyo-dark&orientation=landscape'
    },
    {
      city: 'Paris',
      country: 'France',
      price: 'From $749',
      image: 'https://readdy.ai/api/search-image?query=Paris%20Eiffel%20Tower%20illuminated%20at%20night%20with%20dark%20dramatic%20sky%2C%20romantic%20city%20lights%20reflecting%20on%20Seine%20river%2C%20moody%20evening%20atmosphere%20with%20golden%20tower%20lights%20against%20deep%20blue%20twilight%2C%20cinematic%20French%20architecture%20photography%20with%20mysterious%20dark%20ambiance%2C%20elegant%20night%20scene%20perfect%20for%20travel%20inspiration&width=400&height=300&seq=paris-dark&orientation=landscape'
    },
    {
      city: 'New York',
      country: 'USA',
      price: 'From $599',
      image: 'https://readdy.ai/api/search-image?query=New%20York%20City%20skyline%20at%20night%20with%20illuminated%20skyscrapers%20against%20dark%20sky%2C%20dramatic%20urban%20landscape%20with%20bright%20windows%20creating%20patterns%20of%20light%2C%20moody%20metropolitan%20atmosphere%20with%20glowing%20buildings%20reflecting%20in%20dark%20waters%2C%20cinematic%20night%20photography%20of%20Manhattan%20with%20mysterious%20dark%20ambiance&width=400&height=300&seq=nyc-dark&orientation=landscape'
    },
    {
      city: 'London',
      country: 'UK',
      price: 'From $679',
      image: 'https://readdy.ai/api/search-image?query=London%20cityscape%20at%20night%20with%20Big%20Ben%20and%20Parliament%20buildings%20illuminated%20against%20dark%20stormy%20sky%2C%20dramatic%20British%20architecture%20with%20warm%20golden%20lights%2C%20moody%20evening%20atmosphere%20with%20River%20Thames%20reflecting%20city%20lights%2C%20cinematic%20UK%20landmark%20photography%20with%20mysterious%20dark%20background%20perfect%20for%20travel%20website&width=400&height=300&seq=london-dark&orientation=landscape'
    },
    {
      city: 'Dubai',
      country: 'UAE',
      price: 'From $1,299',
      image: 'https://readdy.ai/api/search-image?query=Dubai%20skyline%20at%20night%20with%20Burj%20Khalifa%20and%20modern%20skyscrapers%20illuminated%20against%20dark%20desert%20sky%2C%20luxurious%20city%20lights%20creating%20dramatic%20Middle%20Eastern%20atmosphere%2C%20futuristic%20architecture%20with%20golden%20lights%20reflecting%20in%20dark%20waters%2C%20cinematic%20UAE%20cityscape%20with%20mysterious%20night%20ambiance%20perfect%20for%20travel%20inspiration&width=400&height=300&seq=dubai-dark&orientation=landscape'
    },
    {
      city: 'Sydney',
      country: 'Australia',
      price: 'From $1,199',
      image: 'https://readdy.ai/api/search-image?query=Sydney%20Opera%20House%20and%20Harbour%20Bridge%20illuminated%20at%20night%20with%20dramatic%20dark%20sky%2C%20iconic%20Australian%20landmarks%20with%20golden%20lights%20reflecting%20in%20dark%20harbor%20waters%2C%20moody%20evening%20atmosphere%20with%20city%20lights%20creating%20cinematic%20ambiance%2C%20mysterious%20night%20photography%20of%20Sydney%20waterfront%20perfect%20for%20travel%20website&width=400&height=300&seq=sydney-dark&orientation=landscape'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Popular Destinations
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Explore the world's most sought-after destinations with exclusive deals and unbeatable prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                transform: `translateY(${scrollY * 0.02 * (index + 1)}px)`,
              }}
            >
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={`${destination.city}, ${destination.country}`}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{destination.city}</h3>
                    <p className="text-gray-300 text-sm">{destination.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-semibold text-base sm:text-lg">{destination.price}</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gray-800/80 backdrop-blur-sm rounded-full p-2">
                <i className="ri-heart-line text-white text-base sm:text-lg hover:text-red-400 transition-colors cursor-pointer"></i>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap cursor-pointer text-sm sm:text-base">
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  );
}
