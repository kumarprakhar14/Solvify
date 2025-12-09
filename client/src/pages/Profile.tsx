import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { login } from "../store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, User } from "lucide-react";

const Profile = () => {
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        password: ''
    });

    const fetchProfile = async () => {
        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
    };

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile,
        enabled: !!accessToken,
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                company: user.company || '',
                password: '' // Don't populate password
            });
        }
    }, [user]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to update profile");
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            dispatch(login({ user: data, accessToken })); // Update Redux state
            toast.success("Profile updated successfully");
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
            setIsEditing(false); // Switch back to view mode
        },
        onError: () => {
            toast.error("Failed to update profile");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-center text-red-500 pt-20">Error loading profile</div>;

    return (
        <div className="min-h-screen bg-background pt-20 pb-10">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-6 w-6" />
                            My Profile
                        </CardTitle>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} variant="outline">
                                Edit Profile
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company Name</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Acme Inc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1" disabled={updateProfileMutation.isPending}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={updateProfileMutation.isPending}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="text-muted-foreground">Full Name</Label>
                                        <p className="text-lg font-medium">{user?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Email Address</Label>
                                        <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Phone Number</Label>
                                        <p className="text-lg font-medium">{user?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Company Name</Label>
                                        <p className="text-lg font-medium">{user?.company || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
