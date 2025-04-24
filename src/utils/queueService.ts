
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
  return queueDatabase;
};

// Get queues by user ID
export const getUserQueues = (userId: string): QueueItem[] => {
  return queueDatabase.filter(queue => queue.userId === userId);
};

// Add a new queue
export const addQueue = (queue: QueueItem): QueueItem => {
  queueDatabase.push(queue);
  saveQueuesToStorage(queueDatabase);
  return queue;
};

// Update queue status
export const updateQueueStatus = (id: string, status: QueueItem['status']): QueueItem | undefined => {
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
  const initialLength = queueDatabase.length;
  queueDatabase = queueDatabase.filter(queue => queue.id !== id);
  saveQueuesToStorage(queueDatabase);
  return queueDatabase.length !== initialLength;
};

// Get the current active queue number
export const getCurrentQueueNumber = (): number => {
  const activeQueues = queueDatabase.filter(q => q.status === "In Progress");
  if (activeQueues.length > 0) {
    return Math.min(...activeQueues.map(q => q.queueNumber));
  }
  return 1; // Default starting number
};

// Initialize with some demo data if no queues exist
export const initializeDemoData = () => {
  if (queueDatabase.length === 0) {
    const demoQueues = [
      {
        id: "S001",
        name: "John Doe",
        service: "Enrollment Assistance",
        time: "10:30 AM",
        status: "Waiting",
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
        status: "Waiting",
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
