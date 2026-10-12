import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Sparkles, AlertCircle, Info } from "lucide-react";
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
        clientEmail: '',
        clientPhone: '',
        clientCompany: '',
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
                clientName: quotation.clientName || '',
                clientEmail: quotation.clientEmail || '',
                clientPhone: quotation.clientPhone || '',
                clientCompany: quotation.clientCompany || '',
                subject: quotation.subject || quotation.projectName || '',
                totalAmount: quotation.totalAmount || 0,
                status: quotation.status || 'pending',
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
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-bold">Edit Quotation {quotation?.quotationId}</CardTitle>
                                <CardDescription className="mt-1">
                                    Review, price, and update the quotation parameters.
                                </CardDescription>
                            </div>
                        </div>

                        {/* AI status banner */}
                        {quotation?.aiError ? (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm">
                                <p className="font-semibold flex items-center gap-1.5 text-amber-800">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                    AI Generation Issue – Requires Manual Processing
                                </p>
                                <p className="mt-1 text-xs text-amber-700">
                                    <strong>Reason:</strong> {quotation.aiError}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    This quotation was preserved with the inquiry's details so you can manually review, specify line items/pricing, and approve it.
                                </p>
                            </div>
                        ) : quotation?.generatedByAi ? (
                            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-sm">
                                <p className="font-semibold flex items-center gap-1.5 text-purple-800">
                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                    AI-Generated Draft
                                </p>
                                <p className="mt-1 text-xs text-purple-700">
                                    This quotation draft was automatically generated by AI from the client's inquiry.
                                </p>
                            </div>
                        ) : null}

                        {/* Linked Inquiry info */}
                        {quotation?.inquiryId && typeof quotation.inquiryId === 'object' && (
                            <div className="mt-3 p-3 bg-muted/40 border rounded-lg text-xs space-y-1">
                                <div className="font-semibold text-foreground flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5 text-primary" />
                                    Linked Inquiry: {quotation.inquiryId.inquiryId}
                                </div>
                                <div className="text-muted-foreground">
                                    Service: <span className="font-medium text-foreground">{quotation.inquiryId.service}</span> |
                                    Budget: <span className="font-medium text-foreground">{quotation.inquiryId.budget}</span> |
                                    Timeline: <span className="font-medium text-foreground">{quotation.inquiryId.timeline}</span>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="clientName">Client Name</Label>
                                    <Input
                                        id="clientName"
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientEmail">Client Email</Label>
                                    <Input
                                        id="clientEmail"
                                        type="email"
                                        value={formData.clientEmail}
                                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="clientCompany">Company</Label>
                                    <Input
                                        id="clientCompany"
                                        value={formData.clientCompany}
                                        onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientPhone">Phone</Label>
                                    <Input
                                        id="clientPhone"
                                        value={formData.clientPhone}
                                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="totalAmount">Total Amount ($)</Label>
                                    <Input
                                        id="totalAmount"
                                        type="number"
                                        value={formData.totalAmount}
                                        onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                                        min={0}
                                        required
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectOverview">Project Overview</Label>
                                <Textarea
                                    id="projectOverview"
                                    rows={4}
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
                                    rows={3}
                                    value={formData.exclusions}
                                    onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                                <Textarea
                                    id="termsAndConditions"
                                    rows={3}
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
