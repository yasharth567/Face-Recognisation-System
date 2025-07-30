
'use client';

import { useEffect, useState } from 'react';

export default function FeaturesSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: 'ri-time-line',
      title: 'Real-time Search',
      description: 'Get instant results from over 500 airlines worldwide with live pricing and availability updates.',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Secure Booking',
      description: 'Your data is protected with bank-level encryption and secure payment processing.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: 'ri-customer-service-line',
      title: '24/7 Support',
      description: 'Our dedicated support team is available around the clock to assist with your travel needs.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'ri-price-tag-line',
      title: 'Best Prices',
      description: 'Compare prices across multiple airlines to find the best deals and save on your flights.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: 'ri-smartphone-line',
      title: 'Mobile Ready',
      description: 'Book flights on any device with our responsive design and mobile-optimized experience.',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      icon: 'ri-global-line',
      title: 'Global Coverage',
      description: 'Access flights to over 1,000 destinations across 200+ countries worldwide.',
      gradient: 'from-teal-500 to-cyan-600'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Why Choose SkySwift?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Experience the future of flight booking with our innovative platform designed to make your travel dreams a reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              style={{
                transform: `translateY(${scrollY * 0.05 * (index + 1)}px)`,
              }}
            >
              <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6`}>
                <i className={`${feature.icon} text-white text-lg sm:text-2xl`}></i>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
