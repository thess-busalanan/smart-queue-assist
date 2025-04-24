
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface QueueConfirmationProps {
  confirmation: {
    id: string;
    queueNumber: number;
    service: string;
    time: string;
    estimatedWaitTime: number;
    purpose?: string;
    urgency: string;
    date: string;
  };
  onViewStatus: () => void;
  onBookAnother: () => void;
}

export const QueueConfirmation = ({ confirmation, onViewStatus, onBookAnother }: QueueConfirmationProps) => {
  return (
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
            <h3 className="text-2xl font-bold text-gray-800">Queue #{confirmation.queueNumber}</h3>
            <p className="text-primary-600 font-semibold">Reference ID: {confirmation.id}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-gray-500 text-sm">Service</p>
              <p className="font-medium">{confirmation.service}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-medium">{confirmation.date}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-sm">Time</p>
              <p className="font-medium">{confirmation.time}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-sm">Estimated Wait Time</p>
              <p className="font-medium">{confirmation.estimatedWaitTime} minutes</p>
            </div>
            {confirmation.purpose && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-gray-500 text-sm">Purpose</p>
                <p className="font-medium">{confirmation.purpose}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-gray-500 text-sm">Priority</p>
              <p className="font-medium">{confirmation.urgency}</p>
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
              onClick={onViewStatus} 
              className="flex-1 bg-primary-600 hover:bg-primary-700"
            >
              View Queue Status
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={onBookAnother}
              className="flex-1"
            >
              Book Another Queue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
