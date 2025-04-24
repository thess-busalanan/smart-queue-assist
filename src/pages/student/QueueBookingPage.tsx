
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { addQueue } from "@/utils/queueService";
import { requestNotificationPermission } from "@/utils/firebase";

// Mock service types and time slots for the frontend demo
const serviceTypes = [
  { id: "enrollment", name: "Enrollment Assistance" },
  { id: "document", name: "Document Request" },
  { id: "scholarship", name: "Scholarship Application" },
  { id: "payment", name: "Payment Processing" },
  { id: "inquiry", name: "General Inquiry" },
];

// Generate time slots starting from current time
const generateTimeSlots = () => {
  const currentHour = new Date().getHours();
  const startHour = currentHour < 17 ? currentHour + 1 : 8; // If after 5PM, show slots for next day starting at 8AM
  
  const slots = [];
  for (let hour = startHour; hour <= 17; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      if (hour === 17 && minutes > 0) continue; // Don't go past 5PM
      
      const hourFormatted = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour >= 12 ? 'PM' : 'AM';
      const minutesFormatted = minutes === 0 ? '00' : minutes;
      
      slots.push({
        id: `${hour}:${minutesFormatted}`,
        time: `${hourFormatted}:${minutesFormatted} ${period}`
      });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const QueueBookingPage = () => {
  const [serviceType, setServiceType] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isUrgent, setIsUrgent] = useState("standard");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Request notification permission when component mounts
    requestNotificationPermission();
  }, []);
  
  // Check authentication status
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to login page with a return URL
    navigate('/login?redirect=queue-booking');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo: simulate API call delay
    setTimeout(() => {
      const userName = localStorage.getItem('userName') || "Anonymous User";
      const userId = localStorage.getItem('userId') || Date.now().toString();
      
      // Generate a random queue number between 1-30
      const queueNumber = Math.floor(Math.random() * 30) + 1;
      
      const confirmation = {
        id: `Q-${Date.now().toString().slice(-6)}`,
        name: userName,
        service: serviceTypes.find(s => s.id === serviceType)?.name || "",
        time: timeSlots.find(t => t.id === timeSlot)?.time || "",
        status: "Waiting" as const,
        queueNumber: queueNumber,
        estimatedWaitTime: queueNumber * 5, // 5 minutes per person
        purpose: purpose,
        urgency: isUrgent === "urgent" ? "Urgent" : "Standard",
        userId: userId,
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      
      // Add to our centralized queue service
      addQueue(confirmation);
      
      setBookingConfirmation(confirmation);
      
      // Save to local storage for queue status retrieval
      localStorage.setItem('queueBooking', JSON.stringify(confirmation));
      
      toast({
        title: "Queue Booked Successfully",
        description: `Your queue number is ${queueNumber}`,
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  const resetForm = () => {
    setServiceType("");
    setTimeSlot("");
    setPurpose("");
    setIsUrgent("standard");
    setBookingConfirmation(null);
  };
  
  const goToQueueStatus = () => {
    navigate('/queue-status');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary-800">Book a Queue</h1>
        
        {!bookingConfirmation ? (
          <Card>
            <CardHeader>
              <CardTitle>Queue Reservation</CardTitle>
              <CardDescription>
                Select your desired service and time slot to reserve your place in the queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="service-type">Service Type</Label>
                    <Select 
                      value={serviceType} 
                      onValueChange={setServiceType}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select the service you need" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="time-slot">Preferred Time Slot</Label>
                    <Select 
                      value={timeSlot} 
                      onValueChange={setTimeSlot}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="purpose">Purpose of Visit (Optional)</Label>
                    <Input
                      id="purpose"
                      placeholder="Briefly explain your purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Priority Level</Label>
                    <RadioGroup
                      value={isUrgent}
                      onValueChange={setIsUrgent}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urgent" id="urgent" />
                        <Label htmlFor="urgent">Urgent</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Processing...
                    </>
                  ) : (
                    "Book Queue"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-center text-green-700">Queue Booking Confirmed!</CardTitle>
              <CardDescription className="text-center text-green-600">
                Your queue has been successfully reserved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 rounded-full p-4 border-4 border-green-200">
                    <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Queue #{bookingConfirmation.queueNumber}</h3>
                  <p className="text-primary-600 font-semibold">Reference ID: {bookingConfirmation.id}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Service</p>
                    <p className="font-medium">{bookingConfirmation.serviceType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Date</p>
                    <p className="font-medium">{bookingConfirmation.date}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Time</p>
                    <p className="font-medium">{bookingConfirmation.timeSlot}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Estimated Wait Time</p>
                    <p className="font-medium">{bookingConfirmation.estimatedWaitTime} minutes</p>
                  </div>
                  {bookingConfirmation.purpose && (
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-gray-500 text-sm">Purpose</p>
                      <p className="font-medium">{bookingConfirmation.purpose}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Priority</p>
                    <p className="font-medium">{bookingConfirmation.urgency}</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Please arrive 5 minutes before your scheduled time. 
                    If you miss your slot, you may need to rebook.
                  </p>
                </div>
                
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                  <Button 
                    onClick={goToQueueStatus} 
                    className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                    View Queue Status
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex-1"
                  >
                    Book Another Queue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default QueueBookingPage;
