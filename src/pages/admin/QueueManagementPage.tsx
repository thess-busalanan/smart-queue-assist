
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bell,
  CheckSquare,
  XSquare,
  ChevronRight,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

// Mock data for queue management
const initialQueues = [
  {
    id: "S001",
    name: "John Doe",
    service: "Enrollment Assistance",
    time: "10:30 AM",
    status: "Waiting",
    queueNumber: 1,
    phone: "123-456-7890",
    email: "john@example.com",
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
  },
  {
    id: "S003",
    name: "Robert Johnson",
    service: "Scholarship Application",
    time: "10:40 AM",
    status: "In Progress",
    queueNumber: 3,
    phone: "123-456-7892",
    email: "robert@example.com",
  },
  {
    id: "S004",
    name: "Emily Davis",
    service: "Payment Processing",
    time: "10:45 AM",
    status: "Waiting",
    queueNumber: 4,
    phone: "123-456-7893",
    email: "emily@example.com",
  },
  {
    id: "S005",
    name: "Michael Brown",
    service: "Document Request",
    time: "10:50 AM",
    status: "No Show",
    queueNumber: 5,
    phone: "123-456-7894",
    email: "michael@example.com",
  },
  {
    id: "S006",
    name: "Amanda Wilson",
    service: "Enrollment Assistance",
    time: "11:00 AM",
    status: "Served",
    queueNumber: 6,
    phone: "123-456-7895",
    email: "amanda@example.com",
  },
  {
    id: "S007",
    name: "Daniel Lee",
    service: "Scholarship Application",
    time: "11:15 AM",
    status: "Cancelled",
    queueNumber: 7,
    phone: "123-456-7896",
    email: "daniel@example.com",
  },
];

// Service types
const serviceTypes = [
  { id: "enrollment", name: "Enrollment Assistance" },
  { id: "document", name: "Document Request" },
  { id: "scholarship", name: "Scholarship Application" },
  { id: "payment", name: "Payment Processing" },
  { id: "inquiry", name: "General Inquiry" },
];

const QueueManagementPage = () => {
  const [queues, setQueues] = useState(initialQueues);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQueue, setSelectedQueue] = useState<any>(null);
  const [isAddingQueue, setIsAddingQueue] = useState(false);
  const [newQueue, setNewQueue] = useState({
    name: "",
    service: "",
    time: "",
    phone: "",
    email: "",
    queueNumber: 0,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is admin
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated || userRole !== 'admin') {
    navigate('/login');
    return null;
  }

  // Filter queues based on active tab and search query
  const filteredQueues = queues.filter((queue) => {
    // Filter by status tab
    if (activeTab !== "all" && queue.status.toLowerCase() !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        queue.name.toLowerCase().includes(query) ||
        queue.id.toLowerCase().includes(query) ||
        queue.service.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Handle queue actions
  const callStudent = (queue: any) => {
    setQueues(
      queues.map((q) =>
        q.id === queue.id ? { ...q, status: "In Progress" } : q
      )
    );
    
    toast({
      title: "Student Called",
      description: `${queue.name} has been called for service.`,
    });
  };
  
  const markAsServed = (queue: any) => {
    setQueues(
      queues.map((q) =>
        q.id === queue.id ? { ...q, status: "Served" } : q
      )
    );
    
    toast({
      title: "Student Served",
      description: `${queue.name} has been marked as served.`,
    });
  };
  
  const markAsNoShow = (queue: any) => {
    setQueues(
      queues.map((q) =>
        q.id === queue.id ? { ...q, status: "No Show" } : q
      )
    );
    
    toast({
      title: "No Show",
      description: `${queue.name} has been marked as a no-show.`,
    });
  };
  
  const handleAddQueue = () => {
    if (!newQueue.name || !newQueue.service || !newQueue.time) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    const newId = `S${String(queues.length + 1).padStart(3, '0')}`;
    const newQueueItem = {
      ...newQueue,
      id: newId,
      status: "Waiting",
      queueNumber: queues.length + 1,
    };
    
    setQueues([...queues, newQueueItem]);
    setIsAddingQueue(false);
    setNewQueue({
      name: "",
      service: "",
      time: "",
      phone: "",
      email: "",
      queueNumber: 0,
    });
    
    toast({
      title: "Queue Added",
      description: "New student has been added to the queue.",
    });
  };
  
  // View queue details
  const viewQueueDetails = (queue: any) => {
    setSelectedQueue(queue);
  };
  
  // Close queue details
  const closeQueueDetails = () => {
    setSelectedQueue(null);
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-primary-800">Queue Management</h1>
        <p className="text-gray-600 mb-8">View and manage all student queues</p>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="waiting">Waiting</TabsTrigger>
                <TabsTrigger value="in progress">In Progress</TabsTrigger>
                <TabsTrigger value="served">Served</TabsTrigger>
                <TabsTrigger value="no show">No Show</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddingQueue(true)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
            <Button variant="outline" onClick={() => setQueues(initialQueues)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        {isAddingQueue ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Student to Queue</CardTitle>
              <CardDescription>Enter the student details to add them to the queue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newQueue.name}
                    onChange={(e) => setNewQueue({ ...newQueue, name: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="service">Service Type</Label>
                  <Select
                    value={newQueue.service}
                    onValueChange={(value) => setNewQueue({ ...newQueue, service: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Time Slot</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newQueue.time}
                    onChange={(e) => setNewQueue({ ...newQueue, time: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newQueue.phone}
                    onChange={(e) => setNewQueue({ ...newQueue, phone: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newQueue.email}
                    onChange={(e) => setNewQueue({ ...newQueue, email: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddingQueue(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddQueue}>
                  Add to Queue
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
        
        {selectedQueue ? (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Student Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={closeQueueDetails}>
                  &times;
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Student ID</p>
                  <p className="font-medium">{selectedQueue.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Queue Number</p>
                  <p className="font-medium">{selectedQueue.queueNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="font-medium">{selectedQueue.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Service Type</p>
                  <p className="font-medium">{selectedQueue.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Time Slot</p>
                  <p className="font-medium">{selectedQueue.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="font-medium">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      selectedQueue.status === "Waiting" ? "bg-blue-100 text-blue-800" :
                      selectedQueue.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                      selectedQueue.status === "Served" ? "bg-green-100 text-green-800" :
                      selectedQueue.status === "No Show" ? "bg-red-100 text-red-800" :
                      selectedQueue.status === "Cancelled" ? "bg-gray-100 text-gray-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {selectedQueue.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="font-medium">{selectedQueue.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="font-medium">{selectedQueue.email || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                {selectedQueue.status === "Waiting" && (
                  <Button 
                    onClick={() => callStudent(selectedQueue)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Call Student
                  </Button>
                )}
                {(selectedQueue.status === "Waiting" || selectedQueue.status === "In Progress") && (
                  <>
                    <Button 
                      onClick={() => markAsServed(selectedQueue)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Mark as Served
                    </Button>
                    <Button 
                      onClick={() => markAsNoShow(selectedQueue)}
                      variant="destructive"
                    >
                      <XSquare className="mr-2 h-4 w-4" />
                      Mark as No Show
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}
        
        <Card>
          <CardHeader>
            <CardTitle>Queue List</CardTitle>
            <CardDescription>
              {filteredQueues.length} student{filteredQueues.length !== 1 ? 's' : ''} in queue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredQueues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No students in queue</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">Student ID</th>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Service</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueues.map((queue) => (
                      <tr key={queue.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{queue.queueNumber}</td>
                        <td className="py-3 px-4">{queue.id}</td>
                        <td className="py-3 px-4 font-medium">{queue.name}</td>
                        <td className="py-3 px-4">{queue.service}</td>
                        <td className="py-3 px-4">{queue.time}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            queue.status === "Waiting" ? "bg-blue-100 text-blue-800" :
                            queue.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                            queue.status === "Served" ? "bg-green-100 text-green-800" :
                            queue.status === "No Show" ? "bg-red-100 text-red-800" :
                            queue.status === "Cancelled" ? "bg-gray-100 text-gray-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {queue.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewQueueDetails(queue)}
                              className="flex items-center text-primary-600"
                            >
                              View <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default QueueManagementPage;
