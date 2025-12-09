import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import SolvifyLogo from "../components/Logo"

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    // send forgot password request to the server
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response

        toast({
          title: "Forgot Password Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      //success! -> consider customizing the display of toast to catch user attention
      toast({
        title: "Email sent!",
        description: data.message || "If an account exists, a reset link has been sent to your email.",
        variant: "default"
      })

      // clear form
      setEmail("");

      if (response.ok) {
        console.log("✅ Forgot password worked!");

      }

    } catch (error) {
      console.error("Forgot password failed: ", error);
      toast({
        title: "Forgot password failed",
        description: "Unable to connect to the server. Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <SolvifyLogo className="w-48 h-auto mt-4" />
        </Link>

        <Card className="gradient-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>We'll help you recover your account. Enter your registered email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                Submit
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Rememeber your credentials?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;