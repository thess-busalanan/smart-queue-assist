
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Users, 
  ClipboardList, 
  CheckCircle,
  Clock,
  Calendar
} from "lucide-react";
import { getAllQueues, updateQueueStatus } from "@/utils/queueService";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [queues, setQueues] = useState([]);
  
  // Check if user is admin
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated || userRole !== 'admin') {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    // Load queues from our service
    const allQueues = getAllQueues();
    setQueues(allQueues);
  }, []);

  // Calculate dashboard stats
  const stats = [
    { 
      label: "Total Students in Queue", 
      value: queues.filter(q => q.status === "Waiting" || q.status === "In Progress").length,
      icon: <Users className="h-5 w-5 text-blue-600" /> 
    },
    { 
      label: "Students Served Today", 
      value: queues.filter(q => q.status === "Served").length,
      icon: <CheckCircle className="h-5 w-5 text-green-600" /> 
    },
    { 
      label: "Average Wait Time", 
      value: "14 min", 
      icon: <Clock className="h-5 w-5 text-orange-600" /> 
    },
    { 
      label: "Scheduled for Today", 
      value: queues.length,
      icon: <Calendar className="h-5 w-5 text-purple-600" /> 
    },
  ];
  
  // Count queues by service type
  const queuesByService = [
    { name: "Enrollment Assistance", count: queues.filter(q => q.service === "Enrollment Assistance").length, color: "bg-blue-500" },
    { name: "Document Request", count: queues.filter(q => q.service === "Document Request").length, color: "bg-green-500" },
    { name: "Scholarship Application", count: queues.filter(q => q.service === "Scholarship Application").length, color: "bg-yellow-500" },
    { name: "Payment Processing", count: queues.filter(q => q.service === "Payment Processing").length, color: "bg-red-500" },
    { name: "General Inquiry", count: queues.filter(q => q.service === "General Inquiry").length, color: "bg-purple-500" },
  ].filter(item => item.count > 0);
  
  // Get upcoming queues
  const upcomingQueues = queues.filter(q => q.status === "Waiting").slice(0, 5);

  // Handle quick actions
  const callNextStudent = () => {
    const nextQueue = queues.find(q => q.status === "Waiting");
    if (nextQueue) {
      updateQueueStatus(nextQueue.id, "In Progress");
      setQueues(queues.map(q => 
        q.id === nextQueue.id ? {...q, status: "In Progress"} : q
      ));
    }
  };

  const markCurrentAsServed = () => {
    const currentQueue = queues.find(q => q.status === "In Progress");
    if (currentQueue) {
      updateQueueStatus(currentQueue.id, "Served");
      setQueues(queues.map(q => 
        q.id === currentQueue.id ? {...q, status: "Served"} : q
      ));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-primary-800">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage and monitor queue operations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Queue Overview</CardTitle>
              <CardDescription>Current queues by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {queuesByService.map((queue, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{queue.name}</span>
                      <span className="text-sm text-gray-500">{queue.count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${queue.color} h-2 rounded-full`} 
                        style={{ width: `${(queue.count / 10) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={() => navigate('/admin/queue-management')}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Manage All Queues
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common queue management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Call Next Student
              </Button>
              <Button className="w-full" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Current as Served
              </Button>
              <Button className="w-full" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Reset Queue Counter
              </Button>
              <Button 
                onClick={() => navigate('/admin/reports')}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                <BarChart className="mr-2 h-4 w-4" />
                View Detailed Reports
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Queue</CardTitle>
            <CardDescription>Students scheduled for service today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Student</th>
                    <th className="py-3 px-4 text-left">Service</th>
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingQueues.map((queue, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">{queue.id}</td>
                      <td className="py-3 px-4">{queue.name}</td>
                      <td className="py-3 px-4">{queue.service}</td>
                      <td className="py-3 px-4">{queue.time}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {queue.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Call</Button>
                          <Button variant="outline" size="sm">Serve</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
