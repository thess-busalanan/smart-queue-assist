import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { QueueBookingForm } from "@/components/queue/QueueBookingForm";
import { QueueConfirmation } from "@/components/queue/QueueConfirmation";
import { requestNotificationPermission } from "@/utils/firebase";
import { addQueue, getAllQueues } from "@/utils/queueService";

const QueueBookingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    navigate('/login?redirect=queue-booking');
    return null;
  }

  const handleSubmit = (formData: any) => {
    setIsLoading(true);
    
    requestNotificationPermission();
    
    const existingQueues = getAllQueues();
    const lastQueueNumber = Math.max(...existingQueues.map(q => q.queueNumber), 0);
    const newQueueNumber = lastQueueNumber + 1;
    
    const userName = localStorage.getItem('userName') || "Anonymous User";
    const userId = localStorage.getItem('userId') || Date.now().toString();
    
    const confirmation = {
      id: `Q-${Date.now().toString().slice(-6)}`,
      name: userName,
      service: formData.serviceType,
      time: formData.timeSlot,
      status: "Waiting" as const,
      queueNumber: newQueueNumber,
      estimatedWaitTime: newQueueNumber * 5, // 5 minutes per person
      purpose: formData.purpose,
      urgency: formData.isUrgent === "urgent" ? "Urgent" : "Standard",
      userId: userId,
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    addQueue(confirmation);
    
    setBookingConfirmation(confirmation);
    
    localStorage.setItem('queueBooking', JSON.stringify(confirmation));
    
    toast({
      title: "Queue Booked Successfully",
      description: `Your queue number is ${newQueueNumber}`,
    });
    
    setIsLoading(false);
  };
  
  const resetForm = () => {
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
          <QueueBookingForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        ) : (
          <QueueConfirmation
            confirmation={bookingConfirmation}
            onViewStatus={goToQueueStatus}
            onBookAnother={resetForm}
          />
        )}
      </div>
    </Layout>
  );
};

export default QueueBookingPage;
