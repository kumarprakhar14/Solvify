import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import SolvifyLogo from "../components/Logo"

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [isValidToken, setIsValidToken] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const validateToken = async () => {
        try {
            const validationResponse = await fetch(`${API_BASE_URL}/api/auth/validate-reset-token/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const validationData = await validationResponse.json();

            // if token is valid -> 

            // set email in the form data to be rendered pre-filled
            if (validationData.valid) {
                setFormData({
                    email: validationData.email,
                    password: "",
                    confirmPassword: ""
                })
            }

            // set token validation status
            setIsValidToken(validationData.valid);
        } catch (error) {
            console.error("Error validating token: ", error);
            setIsValidToken(false);

        }
    }

    useEffect(() => {
        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password || !formData.confirmPassword) {
            toast({
                title: "Missing Information",
                description: "Please fill in all fields.",
                variant: "destructive",
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please ensure your passwords match.",
                variant: "destructive",
            });
            return;
        }

        // send reset password request to the server
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    newPassword: formData.password  // server expects 'newPassword' in req.body
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error response

                toast({
                    title: "Error",
                    description: data.message || "Something went wrong",
                    variant: "destructive"
                });
                return;
            }

            // success!
            toast({
                title: "Success",
                description: "Password reset successfully",
            })

            // clear form
            setFormData({
                email: "",
                password: "",
                confirmPassword: ""
            });

            // redirect to login
            navigate('/login');
        } catch (error) {
            console.error("Reset Password Error: ", error);
            toast({
                title: "Error",
                description: "Unable to connect to the server. Please try again",
                variant: "destructive",
            })

        }
    };

    return (
        (isValidToken) ? (
            <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
                <div className="w-full max-w-md">
                    <Link to="/" className="flex items-center justify-center gap-2 mb-8">
                        <SolvifyLogo className="w-48 h-auto mt-4" />
                    </Link>

                    <Card className="gradient-card border-border">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Reset Password</CardTitle>
                            <CardDescription>Enter your new password</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        disabled={true}  // user can't change the pre-filled email
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <Button type="submit" variant="hero" size="lg" className="w-full">
                                    Reset Password
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Remember Password?{" "}
                                    <Link to="/login" className="text-primary hover:underline font-medium">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        ) : (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-4">
                <SolvifyLogo className="w-48 h-auto mb-8" />
                <div className="text-center">
                    <h1 className="mb-4 text-4xl font-bold">Invalid URL</h1>
                    <p className="mb-4 text-xl text-gray-400">The link you followed may be broken or expired.</p>
                    <a href="/" className="text-blue-500 underline hover:text-blue-700">
                        Return to Home
                    </a>
                </div>
            </div>
        )

    );
}

export default ResetPassword;