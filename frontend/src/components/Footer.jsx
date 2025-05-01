import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-soft-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div className="mb-4 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">About Us</h5>
            <p className="text-gray-400">
              We are a leading platform providing excellent resources for learning. Our mission is to empower students and professionals alike.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="mb-4 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Quick Links</h5>
            <ul>
              <li><a href="/about" className="text-gray-400 hover:text-gray-200">About</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-gray-200">Contact</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-gray-200">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-gray-200">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="mb-4 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Contact Us</h5>
            <p className="text-gray-400">Email: <a href="mailto:study_circle@gmail.com" className="hover:text-gray-200">study_circle@gmail.com</a></p>
            <p className="text-gray-400">Phone: +1 (123) 456-7890</p>
            <p className="text-gray-400">Address: 4/5 A, LM St., Kolkata, India</p>
          </div>
        </div>

        {/* Bottom Section: Social Links and Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Icons */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="https://github.com/TapamitaMondal07" className="text-gray-400 hover:text-white" aria-label="GitHub">
                <FaGithub size={24} />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 StudyCircle. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
