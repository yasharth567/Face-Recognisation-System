
'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl sm:text-2xl font-bold text-white font-pacifico">SkySwift</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md text-sm sm:text-base">
              Your trusted partner in air travel. Book flights to over 1,000 destinations worldwide with competitive prices and exceptional service.
            </p>
            <div className="flex space-x-4">
              <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-gray-400 hover:text-white text-sm sm:text-base"></i>
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <i className="ri-twitter-fill text-gray-400 hover:text-white text-sm sm:text-base"></i>
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <i className="ri-instagram-line text-gray-400 hover:text-white text-sm sm:text-base"></i>
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <i className="ri-linkedin-fill text-gray-400 hover:text-white text-sm sm:text-base"></i>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/flights" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Search Flights</Link></li>
              <li><Link href="/deals" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Flight Deals</Link></li>
              <li><Link href="/destinations" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Destinations</Link></li>
              <li><Link href="/check-in" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Check-in</Link></li>
              <li><Link href="/manage" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Manage Booking</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-base sm:text-lg">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © 2024 SkySwift. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <span className="text-gray-400 text-sm">We accept:</span>
            <div className="flex space-x-2">
              <i className="ri-visa-line text-gray-400 text-lg sm:text-xl"></i>
              <i className="ri-mastercard-line text-gray-400 text-lg sm:text-xl"></i>
              <i className="ri-paypal-line text-gray-400 text-lg sm:text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
