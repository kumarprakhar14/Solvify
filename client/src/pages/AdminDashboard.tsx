import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminNavbar from "@/components/AdminNavbar";

interface Quotation {
    _id: string;
    quotationId: string;
    clientName: string;
    projectTitle?: string;
    subject: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

const AdminDashboard = () => {
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

    const fetchQuotations = async () => {
        const res = await fetch(`${API_BASE_URL}/api/quotations`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error("Failed to fetch quotations");
        const data = await res.json();
        return data.data;
    };

    const { data: quotations, isLoading, error } = useQuery({
        queryKey: ['quotations'],
        queryFn: fetchQuotations
    });

    const inviteMutation = useMutation({
        mutationFn: async (adminData: typeof newAdmin) => {
            const res = await fetch(`${API_BASE_URL}/api/admin/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(adminData)
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to invite admin");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Admin added successfully");
            setIsInviteOpen(false);
            setNewAdmin({ name: '', email: '', password: '' });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inviteMutation.mutate(newAdmin);
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-center text-red-500">Error loading quotations</div>;

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-2">
                        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" /> Add Admin</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Admin</DialogTitle>
                                    <DialogDescription>
                                        Create a new admin account. They will have full access to the dashboard.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleInviteSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={inviteMutation.isPending}>
                                            {inviteMutation.isPending ? "Adding..." : "Add Admin"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Button onClick={() => navigate('/quotations/new')}>Create New Quotation</Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {quotations?.map((quote: Quotation) => (
                        <Card key={quote._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/admin/quotations/${quote._id}`)}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {quote.quotationId} - {quote.clientName}
                                </CardTitle>
                                <Badge variant={quote.status === 'sent' ? 'default' : 'secondary'}>
                                    {quote.status}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{quote.subject}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total: ${quote.totalAmount} | Created: {new Date(quote.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                    {quotations?.length === 0 && <p className="text-center text-muted-foreground">No quotations found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
