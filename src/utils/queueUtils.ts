
// Service types definition
export const serviceTypes = [
  { id: "enrollment", name: "Enrollment Assistance" },
  { id: "document", name: "Document Request" },
  { id: "scholarship", name: "Scholarship Application" },
  { id: "payment", name: "Payment Processing" },
  { id: "inquiry", name: "General Inquiry" },
];

// Generate time slots starting from current time
export const generateTimeSlots = () => {
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
