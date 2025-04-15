
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, PieChart, Download, Calendar } from "lucide-react";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [reportPeriod, setReportPeriod] = useState("today");
  
  // Check if user is admin
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated || userRole !== 'admin') {
    navigate('/login');
    return null;
  }
  
  // Mock data for service type distribution
  const serviceData = [
    { service: "Enrollment Assistance", count: 42, color: "#3b82f6" },
    { service: "Document Request", count: 35, color: "#10b981" },
    { service: "Scholarship Application", count: 18, color: "#f59e0b" },
    { service: "Payment Processing", count: 15, color: "#ef4444" },
    { service: "General Inquiry", count: 24, color: "#8b5cf6" },
  ];
  
  // Mock data for hourly distribution
  const hourlyData = [
    { hour: "8-9 AM", count: 8 },
    { hour: "9-10 AM", count: 12 },
    { hour: "10-11 AM", count: 18 },
    { hour: "11-12 PM", count: 15 },
    { hour: "12-1 PM", count: 5 },
    { hour: "1-2 PM", count: 10 },
    { hour: "2-3 PM", count: 14 },
    { hour: "3-4 PM", count: 12 },
    { hour: "4-5 PM", count: 10 },
  ];
  
  // Mock data for daily stats
  const dailyStats = {
    totalServed: 104,
    averageWaitTime: "18 min",
    peakHour: "10-11 AM",
    totalNoShows: 12,
    completionRate: "91.5%",
    totalBookings: 116,
  };
  
  // Mock data for weekly trends
  const weeklyTrends = [
    { day: "Monday", count: 98 },
    { day: "Tuesday", count: 87 },
    { day: "Wednesday", count: 104 },
    { day: "Thursday", count: 116 },
    { day: "Friday", count: 92 },
  ];
  
  // Calculate total services
  const totalServices = serviceData.reduce((total, item) => total + item.count, 0);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-primary-800">Queue Reports</h1>
        <p className="text-gray-600 mb-8">Analyze service queue data and statistics</p>
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <Tabs defaultValue="overview" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">By Service</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Total Students Served</p>
                <p className="text-4xl font-bold mt-2 text-primary-700">{dailyStats.totalServed}</p>
                <p className="text-sm text-gray-500 mt-1">out of {dailyStats.totalBookings} bookings</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Average Wait Time</p>
                <p className="text-4xl font-bold mt-2 text-primary-700">{dailyStats.averageWaitTime}</p>
                <p className="text-sm text-gray-500 mt-1">per student</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-4xl font-bold mt-2 text-primary-700">{dailyStats.completionRate}</p>
                <p className="text-sm text-gray-500 mt-1">{dailyStats.totalNoShows} no-shows</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>
                Breakdown of services requested by students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-52 w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full border-8 border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{totalServices}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                </div>
                
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  {/* Mock pie chart segments */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="25 75" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="20 80" strokeDashoffset="-25" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="15 85" strokeDashoffset="-45" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="10 90" strokeDashoffset="-60" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="30 70" strokeDashoffset="-70" />
                </svg>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {serviceData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1 text-sm">{item.service}</div>
                    <div className="font-medium">{item.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hourly Distribution</CardTitle>
              <CardDescription>
                Number of students served per hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end space-x-2">
                {hourlyData.map((item, index) => {
                  const maxCount = Math.max(...hourlyData.map(d => d.count));
                  const height = (item.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary-600 rounded-t-sm" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-500 whitespace-nowrap -rotate-45 origin-top-left">
                        {item.hour}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between mt-10 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Peak Hour:</span> {dailyStats.peakHour}
                </div>
                <div>
                  <span className="font-medium">Total:</span> {dailyStats.totalServed} students
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>
              Student queue patterns throughout the week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end space-x-6 px-4">
              {weeklyTrends.map((item, index) => {
                const maxCount = Math.max(...weeklyTrends.map(d => d.count));
                const height = (item.count / maxCount) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="text-sm mb-2">{item.count}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-md"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-sm mt-2">{item.day}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ReportsPage;
