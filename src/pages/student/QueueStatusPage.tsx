
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Clock, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const QueueStatusPage = () => {
  const [queueData, setQueueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQueueNumber, setCurrentQueueNumber] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login page with a return URL
    navigate('/login?redirect=queue-status');
    return null;
  }

  useEffect(() => {
    // Load queue data from local storage (for the frontend demo)
    const storedQueue = localStorage.getItem('queueBooking');
    
    if (storedQueue) {
      const queueData = JSON.parse(storedQueue);
      setQueueData(queueData);
      
      // Calculate time remaining based on the number of people ahead
      const peopleAhead = queueData.queueNumber - currentQueueNumber;
      const timePerPerson = 5; // 5 minutes per person
      setTimeRemaining(peopleAhead * timePerPerson);
      
      // Simulate queue progress by moving forward one number every few seconds
      const interval = setInterval(() => {
        setCurrentQueueNumber(prevNumber => {
          const newNumber = prevNumber + 1;
          
          // If the queue is getting close to the user's number
          if (newNumber === queueData.queueNumber - 2) {
            toast({
              title: "Your turn is approaching",
              description: "Please be ready. You are 2 positions away.",
            });
          }
          
          return newNumber;
        });
      }, 10000); // Move forward every 10 seconds for demo
      
      setLoading(false);
      
      return () => clearInterval(interval);
    } else {
      // If there's no queue data, redirect to booking page
      setLoading(false);
    }
  }, []);

  const cancelQueue = () => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      localStorage.removeItem('queueBooking');
      
      toast({
        title: "Queue Cancelled",
        description: "Your queue spot has been cancelled successfully.",
      });
      
      setQueueData(null);
      setLoading(false);
      
      // Redirect to booking page
      navigate('/queue-booking');
    }, 1000);
  };

  // Calculate the progress percentage
  const calculateProgress = () => {
    if (!queueData) return 0;
    const total = queueData.queueNumber;
    const progress = (currentQueueNumber / total) * 100;
    return Math.min(progress, 100);
  };

  // Determine if the user's turn is getting close
  const isApproaching = queueData && (queueData.queueNumber - currentQueueNumber) <= 3;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary-800">Queue Status</h1>
        
        {loading ? (
          <Card className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mr-2" />
            <p>Loading queue information...</p>
          </Card>
        ) : !queueData ? (
          <Card>
            <CardHeader>
              <CardTitle>No Active Queue</CardTitle>
              <CardDescription>You don't have any active queue bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-4 text-gray-500">Looks like you haven't booked a queue slot yet.</p>
                <Button className="mt-6" onClick={() => navigate('/queue-booking')}>
                  Book a Queue Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Queue Information</CardTitle>
                <CardDescription>Track your position in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Service</p>
                    <p className="font-medium">{queueData.serviceType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Queue Number</p>
                    <p className="font-bold text-xl text-primary-700">#{queueData.queueNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Scheduled Time</p>
                    <p className="font-medium">{queueData.timeSlot}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Reference ID</p>
                    <p className="font-medium">{queueData.id}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-primary-600" />
                      <span className="font-medium">Queue Progress</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Current number: <span className="font-medium text-primary-700">#{currentQueueNumber}</span>
                    </span>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Start</span>
                    <span>Your position: #{queueData.queueNumber}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 p-4 rounded-lg text-center w-full">
                    <p className="text-lg font-medium">Estimated Waiting Time</p>
                    <div className="text-3xl font-bold text-primary-700 my-2">
                      {queueData.queueNumber - currentQueueNumber <= 0
                        ? "It's your turn now!"
                        : `${(queueData.queueNumber - currentQueueNumber) * 5} minutes`}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {queueData.queueNumber - currentQueueNumber} people ahead of you
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={cancelQueue}
                >
                  Cancel Queue Slot
                </Button>
              </CardFooter>
            </Card>
            
            {isApproaching && (
              <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Your turn is approaching!</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Please make your way to the office now. You are {queueData.queueNumber - currentQueueNumber} positions away from being served.
                </AlertDescription>
              </Alert>
            )}
            
            {queueData.queueNumber - currentQueueNumber <= 0 && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">It's your turn now!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Please proceed to the office immediately. The staff is ready to serve you.
                </AlertDescription>
              </Alert>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Office Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium">Office Hours</p>
                  <p className="text-gray-600">Monday - Friday, 8:00 AM - 5:00 PM</p>
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">Admin Building, Ground Floor, Room 101</p>
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-gray-600">office@school.edu | (123) 456-7890</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default QueueStatusPage;
