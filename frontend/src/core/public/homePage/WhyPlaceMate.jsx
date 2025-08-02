import { FaCheckCircle } from "react-icons/fa";

const WhyPlaceMate = () => {
  const features = [
    "Verified Listings",
    "Affordable Deals",
    "Secure & Trusted",
    "24/7 Support"
  ];

  return (
    <section className="py-16 px-6 dmd:px-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">Why PlaceMate?</h2>
      <div className="grid md:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 border rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <FaCheckCircle className="text-blue-600 text-3xl mb-4" />
            <p className="text-lg font-medium">{feature}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyPlaceMate;
