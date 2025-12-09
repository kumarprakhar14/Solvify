import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Check, X, Edit } from "lucide-react";
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

const AdminQuotations = () => {
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

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

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch(`${API_BASE_URL}/api/quotations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
            toast.success("Quotation status updated");
        },
        onError: () => {
            toast.error("Failed to update status");
        }
    });

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-center text-red-500">Error loading quotations</div>;

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Quotations</h1>
                    <Button onClick={() => navigate('/quotations/new')}>Create New Quotation</Button>
                </div>

                <div className="grid gap-4">
                    {quotations?.map((quote: Quotation) => (
                        <Card key={quote._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {quote.quotationId} - {quote.clientName}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant={
                                        quote.status === 'approved' ? 'default' :
                                            quote.status === 'rejected' ? 'destructive' : 'secondary'
                                    }>
                                        {quote.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-2xl font-bold">{quote.subject}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Total: ${quote.totalAmount} | Created: {new Date(quote.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => navigate(`/admin/quotations/${quote._id}`)}>
                                            <Edit className="h-4 w-4 mr-1" /> Edit
                                        </Button>
                                        {quote.status === 'pending' && (
                                            <>
                                                <Button size="sm" variant="default" onClick={() => updateStatusMutation.mutate({ id: quote._id, status: 'approved' })}>
                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => updateStatusMutation.mutate({ id: quote._id, status: 'rejected' })}>
                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {quotations?.length === 0 && <p className="text-center text-muted-foreground">No quotations found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminQuotations;
