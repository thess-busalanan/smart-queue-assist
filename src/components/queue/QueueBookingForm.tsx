
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { serviceTypes, generateTimeSlots } from "@/utils/queueUtils";

interface QueueBookingFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

export const QueueBookingForm = ({ onSubmit, isLoading }: QueueBookingFormProps) => {
  const [serviceType, setServiceType] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isUrgent, setIsUrgent] = useState("standard");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      serviceType,
      timeSlot,
      purpose,
      isUrgent
    });
  };

  return (
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
                  {generateTimeSlots().map((slot) => (
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
            {isLoading ? "Processing..." : "Book Queue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
