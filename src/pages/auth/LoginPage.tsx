
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // For frontend demo purposes only
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login logic (for frontend-only demo)
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'admin123') {
        toast({
          title: "Login successful",
          description: "Welcome back, Admin!",
        });
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userName', 'Admin User');
        navigate('/admin/dashboard');
      } else if (email === 'student@example.com' && password === 'student123') {
        toast({
          title: "Login successful",
          description: "Welcome back, Student!",
        });
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userName', 'Student User');
        navigate('/queue-booking');
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Try again.",
        });
        localStorage.setItem('isAuthenticated', 'false');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center my-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              <span>Demo Credentials:</span>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs bg-gray-50 p-2 rounded-md">
                <div className="text-left">
                  <p><strong>Admin:</strong></p>
                  <p>Email: admin@example.com</p>
                  <p>Password: admin123</p>
                </div>
                <div className="text-left">
                  <p><strong>Student:</strong></p>
                  <p>Email: student@example.com</p>
                  <p>Password: student123</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
