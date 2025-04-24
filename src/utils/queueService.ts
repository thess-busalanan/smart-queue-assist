
// Centralized queue management service
export interface QueueItem {
  id: string;
  name: string;
  service: string;
  time: string;
  status: "Waiting" | "In Progress" | "Served" | "No Show" | "Cancelled";
  queueNumber: number;
  phone?: string;
  email?: string;
  userId?: string;
  purpose?: string;
  urgency?: string;
  date: string;
}

// Load queues from localStorage or initialize with demo data
const loadQueuesFromStorage = (): QueueItem[] => {
  const storedQueues = localStorage.getItem('queueDatabase');
  if (storedQueues) {
    return JSON.parse(storedQueues);
  }
  return [];
};

// Save queues to localStorage
const saveQueuesToStorage = (queues: QueueItem[]) => {
  localStorage.setItem('queueDatabase', JSON.stringify(queues));
};

// Initialize queue database from storage
let queueDatabase: QueueItem[] = loadQueuesFromStorage();

// Get queue by ID
export const getQueueById = (id: string): QueueItem | undefined => {
  return queueDatabase.find(queue => queue.id === id);
};

// Get all queues
export const getAllQueues = (): QueueItem[] => {
  // Reload from storage to ensure we have the latest data
  queueDatabase = loadQueuesFromStorage();
  return queueDatabase;
};

// Get queues by user ID
export const getUserQueues = (userId: string): QueueItem[] => {
  // Reload from storage to ensure we have the latest data
  queueDatabase = loadQueuesFromStorage();
  return queueDatabase.filter(queue => queue.userId === userId);
};

// Add a new queue
export const addQueue = (queue: QueueItem): QueueItem => {
  // Ensure we're working with the latest database
  queueDatabase = loadQueuesFromStorage();
  
  // Add the new queue
  queueDatabase.push(queue);
  
  // Save to storage
  saveQueuesToStorage(queueDatabase);
  
  // Log for debugging
  console.log('Queue added:', queue);
  console.log('Updated database:', queueDatabase);
  
  return queue;
};

// Update queue status
export const updateQueueStatus = (id: string, status: QueueItem['status']): QueueItem | undefined => {
  // Ensure we're working with the latest database
  queueDatabase = loadQueuesFromStorage();
  
  const index = queueDatabase.findIndex(queue => queue.id === id);
  if (index !== -1) {
    queueDatabase[index].status = status;
    saveQueuesToStorage(queueDatabase);
    return queueDatabase[index];
  }
  return undefined;
};

// Delete queue
export const deleteQueue = (id: string): boolean => {
  // Ensure we're working with the latest database
  queueDatabase = loadQueuesFromStorage();
  
  const initialLength = queueDatabase.length;
  queueDatabase = queueDatabase.filter(queue => queue.id !== id);
  saveQueuesToStorage(queueDatabase);
  return queueDatabase.length !== initialLength;
};

// Get the current active queue number
export const getCurrentQueueNumber = (): number => {
  // Ensure we're working with the latest database
  queueDatabase = loadQueuesFromStorage();
  
  if (queueDatabase.length === 0) {
    return 1; // Default starting number
  }
  
  // Get the highest queue number and add 1
  return Math.max(...queueDatabase.map(q => q.queueNumber)) + 1;
};

// Initialize with some demo data if no queues exist
export const initializeDemoData = () => {
  queueDatabase = loadQueuesFromStorage();
  
  if (queueDatabase.length === 0) {
    const demoQueues = [
      {
        id: "S001",
        name: "John Doe",
        service: "Enrollment Assistance",
        time: "10:30 AM",
        status: "Waiting" as const,  // Use 'as const' to fix the type
        queueNumber: 1,
        phone: "123-456-7890",
        email: "john@example.com",
        userId: "student1",
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      {
        id: "S002",
        name: "Jane Smith",
        service: "Document Request",
        time: "10:35 AM",
        status: "Waiting" as const,  // Use 'as const' to fix the type
        queueNumber: 2,
        phone: "123-456-7891",
        email: "jane@example.com",
        userId: "student2",
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
    ];
    demoQueues.forEach(queue => addQueue(queue));
  }
};

// Call initialization
initializeDemoData();
