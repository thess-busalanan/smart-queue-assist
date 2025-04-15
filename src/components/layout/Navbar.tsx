
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  LogIn, 
  LogOut,
  BarChart,
  Calendar,
  Clock,
  Home,
  Users
} from "lucide-react";

// Mock authentication state - to be replaced with actual auth later
const useAuth = () => {
  // For frontend-only: hardcoded roles for demonstration
  const storedRole = localStorage.getItem('userRole');
  const storedIsAuth = localStorage.getItem('isAuthenticated');
  
  return {
    isAuthenticated: storedIsAuth === 'true',
    role: storedRole || 'guest',
    login: (role: string) => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
    },
    logout: () => {
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.setItem('userRole', 'guest');
    }
  };
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, role, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} />, access: ["guest", "student", "admin"] },
    { name: "Book Queue", path: "/queue-booking", icon: <Calendar size={18} />, access: ["student", "admin"] },
    { name: "Queue Status", path: "/queue-status", icon: <Clock size={18} />, access: ["student", "admin"] },
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: <BarChart size={18} />, access: ["admin"] },
    { name: "Queue Management", path: "/admin/queue-management", icon: <Users size={18} />, access: ["admin"] },
    { name: "Reports", path: "/admin/reports", icon: <BarChart size={18} />, access: ["admin"] },
    { name: "Profile", path: "/profile", icon: <User size={18} />, access: ["student", "admin"] },
  ];

  const filteredLinks = navLinks.filter(link => 
    role === 'guest' ? link.access.includes('guest') : link.access.includes(role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center space-x-3">
            <span className="font-bold text-xl">Smart Queue</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition ${
                  isActive(link.path) ? "bg-primary-700" : ""
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-primary-700 hover:text-white"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-primary-700 hover:text-white"
                  size="sm"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-primary-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition ${
                  isActive(link.path) ? "bg-primary-700" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <Button 
                variant="ghost"
                className="flex w-full justify-start text-white hover:bg-primary-700"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/login" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="ghost"
                  className="flex w-full justify-start text-white hover:bg-primary-700"
                  size="sm"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
