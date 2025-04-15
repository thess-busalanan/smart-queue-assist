
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const useAuth = () => {
  // For frontend demo: get auth status from localStorage
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  return {
    isAuthenticated: isAuth
  };
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-primary-800">Smart Queue Management System</h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern solution to efficiently manage and organize queues in school offices
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                    Login to Get Started
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Create an Account
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/queue-booking">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                    Book a Queue
                  </Button>
                </Link>
                <Link to="/queue-status">
                  <Button variant="outline" size="lg">
                    Check Queue Status
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <CalendarIcon className="h-8 w-8 text-primary-600" />
                </div>
                <CardTitle>Book Your Queue</CardTitle>
                <CardDescription>Reserve your spot in line from anywhere</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Choose the service you need, select an available time slot, and confirm your booking. No more waiting in physical lines!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <ClockIcon className="h-8 w-8 text-primary-600" />
                </div>
                <CardTitle>Track Your Queue</CardTitle>
                <CardDescription>Monitor your position in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Get updates on your queue position and estimated waiting time. Receive notifications when your turn is approaching.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                  <UserIcon className="h-8 w-8 text-primary-600" />
                </div>
                <CardTitle>Get Served</CardTitle>
                <CardDescription>Arrive just in time for your turn</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Show up at the office when it's almost your turn. No more wasting time waiting in hallways or lobbies.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Benefits</h2>
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-lg">
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start">
                <div className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Reduce waiting time and physical queues</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Real-time queue status updates</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Improved office productivity and organization</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Better planning of student and staff time</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Elimination of overcrowding in waiting areas</span>
              </li>
              <li className="flex items-start">
                <div className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span>Data insights to improve service efficiency</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Get Started?</h2>
          {!isAuthenticated ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                  Login Now
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/queue-booking">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Book Your Queue Now
              </Button>
            </Link>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
