
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const [name, setName] = useState(localStorage.getItem('userName') || "Student User");
  const [email, setEmail] = useState(localStorage.getItem('userRole') === 'admin' ? "admin@example.com" : "student@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check authentication status
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    navigate('/login?redirect=profile');
    return null;
  }

  const userRole = localStorage.getItem('userRole');
  
  // Mock queue history for the frontend demo
  const queueHistory = [
    {
      id: 'Q-123456',
      service: 'Document Request',
      date: '2023-04-10',
      time: '10:30 AM',
      status: 'Completed'
    },
    {
      id: 'Q-123457',
      service: 'Enrollment Assistance',
      date: '2023-03-15',
      time: '2:00 PM',
      status: 'Completed'
    },
    {
      id: 'Q-123458',
      service: 'Scholarship Application',
      date: '2023-02-28',
      time: '11:00 AM',
      status: 'Cancelled'
    },
  ];
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      localStorage.setItem('userName', name);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
      setIsSaving(false);
    }, 1000);
  };
  
  const handleChangePassword = () => {
    setIsChangingPassword(true);
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Your new password and confirmation don't match.",
      });
      setIsChangingPassword(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-primary-800">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Personal Information</TabsTrigger>
            <TabsTrigger value="history">Queue History</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  View and edit your personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <div className="flex mt-2">
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                          className={isEditing ? "" : "opacity-70"}
                        />
                        {!isEditing ? (
                          <Button 
                            variant="outline"
                            className="ml-2"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button 
                            className="ml-2"
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="mt-2 opacity-70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={userRole === 'admin' ? 'Administrator' : 'Student'}
                        disabled
                        className="mt-2 opacity-70"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <Button 
                        className="w-full"
                        onClick={handleChangePassword}
                        disabled={!currentPassword || !newPassword || !confirmPassword || isChangingPassword}
                      >
                        {isChangingPassword ? "Changing Password..." : "Change Password"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Queue History</CardTitle>
                <CardDescription>
                  View your previous queue bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {queueHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You haven't booked any queues yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left">Reference ID</th>
                          <th className="py-3 px-4 text-left">Service</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Time</th>
                          <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queueHistory.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{item.id}</td>
                            <td className="py-3 px-4">{item.service}</td>
                            <td className="py-3 px-4">{item.date}</td>
                            <td className="py-3 px-4">{item.time}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                item.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
