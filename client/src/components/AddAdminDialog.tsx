import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
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

const AddAdminDialog = () => {
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

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

    return (
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
    );
};

export default AddAdminDialog;
