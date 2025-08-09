import { FaCheckCircle, FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#503E4D] text-white pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide text-yellow-200">📍 Contact Us</h2>
          <p className="text-sm flex items-center gap-2 text-gray-100">
            <FaMapMarkerAlt className="text-lg text-yellow-300" />
            Dillibazar, Kathmandu
          </p>
          <p className="text-sm flex items-center gap-2 mt-2 text-gray-100">
            <FaPhoneAlt className="text-lg text-yellow-300" />
            +977 9820002202
          </p>
          <p className="text-sm flex items-center gap-2 mt-2 text-gray-100">
            <FaEnvelope className="text-lg text-yellow-300" />
            placemate@gmail.com
          </p>
          <div className="flex gap-4 mt-4 text-gray-300 text-lg">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide text-yellow-200">⭐ Why Choose Us?</h2>
          <ul className="text-sm space-y-2 text-gray-100">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-300" /> Verified Listings
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-300" /> Affordable Deals
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-300" /> Secure & Trusted
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-300" /> 24/7 Support
            </li>
          </ul>
        </div>

        {/* Map Section */}
        <div>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide text-yellow-200">🌐 Our Location</h2>
          <div className="rounded-md overflow-hidden shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.360991583803!2d85.3299792!3d27.706138399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190a74aa1f23%3A0x74ebef82ad0e5c15!2sSoftwarica%20College%20of%20IT%20and%20E-Commerce!5e0!3m2!1sen!2snp!4v1754017426080!5m2!1sen!2snp"
              width="100%"
              height="120"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-300 mt-6 border-t border-gray-600 pt-4">
        &copy; {new Date().getFullYear()} PlaceMate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
