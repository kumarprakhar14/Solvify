import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { Textarea } from "@/components/ui/textarea";

const QuotationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const queryClient = useQueryClient();
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const [formData, setFormData] = useState({
        clientName: '',
        subject: '',
        totalAmount: 0,
        status: 'pending',
        projectOverview: '',
        timeline: '',
        exclusions: '',
        termsAndConditions: ''
    });

    const fetchQuotation = async () => {
        const res = await fetch(`${API_BASE_URL}/api/quotations/${id}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error("Failed to fetch quotation");
        const data = await res.json();
        return data.data;
    };

    const { data: quotation, isLoading, error } = useQuery({
        queryKey: ['quotation', id],
        queryFn: fetchQuotation
    });

    useEffect(() => {
        if (quotation) {
            setFormData({
                clientName: quotation.clientName,
                subject: quotation.subject,
                totalAmount: quotation.totalAmount,
                status: quotation.status,
                projectOverview: quotation.projectOverview || '',
                timeline: quotation.timeline || '',
                exclusions: quotation.exclusions || '',
                termsAndConditions: quotation.termsAndConditions || ''
            });
        }
    }, [quotation]);

    const updateMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch(`${API_BASE_URL}/api/quotations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to update quotation");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotations'] });
            queryClient.invalidateQueries({ queryKey: ['quotation', id] });
            toast.success("Quotation updated successfully");
            navigate('/admin/quotations');
        },
        onError: () => {
            toast.error("Failed to update quotation");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-center text-red-500">Error loading quotation</div>;

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />
            <div className="container mx-auto p-6">
                <Button variant="ghost" className="mb-4" onClick={() => navigate('/admin/quotations')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotations
                </Button>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Quotation {quotation?.quotationId}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Client Name</Label>
                                <Input
                                    id="clientName"
                                    value={formData.clientName}
                                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalAmount">Total Amount</Label>
                                <Input
                                    id="totalAmount"
                                    type="number"
                                    value={formData.totalAmount}
                                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="sent">Sent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectOverview">Project Overview</Label>
                                <Textarea
                                    id="projectOverview"
                                    value={formData.projectOverview}
                                    onChange={(e) => setFormData({ ...formData, projectOverview: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeline">Timeline</Label>
                                <Input
                                    id="timeline"
                                    value={formData.timeline}
                                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="exclusions">Exclusions</Label>
                                <Textarea
                                    id="exclusions"
                                    value={formData.exclusions}
                                    onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                                <Textarea
                                    id="termsAndConditions"
                                    value={formData.termsAndConditions}
                                    onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                                <Save className="mr-2 h-4 w-4" />
                                {updateMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default QuotationDetails;
