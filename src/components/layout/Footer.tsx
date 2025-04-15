
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold">Smart Queue Management System</Link>
            <p className="text-gray-400 mt-2">Making school office visits efficient and organized</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">&copy; {currentYear} Smart Queue. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
