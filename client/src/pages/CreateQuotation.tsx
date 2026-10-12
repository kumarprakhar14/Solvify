import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Plus, Trash2, Save, Loader2 } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";

interface LineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

const CreateQuotation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");

    const [formData, setFormData] = useState({
        clientName: "",
        clientEmail: "",
        clientCompany: "",
        clientPhone: "",
        subject: "",
        projectOverview: "",
        timeline: "2-4 Weeks",
        paymentTerms: "Milestone 1: 40% Advance, Milestone 2: 30% Midpoint, Milestone 3: 30% Delivery",
        exclusions: "Domain, hosting, and third-party API costs are excluded.",
        termsAndConditions: "Quotation is valid for 14 days from issue date.",
        status: "pending",
        taxPercentage: 0,
        discount: 0,
        lineItems: [
            { description: "Initial Consultation & Architecture Setup", quantity: 1, unitPrice: 500, subtotal: 500 }
        ] as LineItem[],
        totalAmount: 500,
        subtotal: 500,
    });

    const recalculateTotals = (items: LineItem[], tax = formData.taxPercentage, disc = formData.discount) => {
        const sub = items.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
        const taxAmt = (sub * Number(tax)) / 100;
        const total = Math.max(0, sub + taxAmt - Number(disc));
        return { subtotal: sub, totalAmount: total };
    };

    const handleLineItemChange = (index: number, field: keyof LineItem, value: any) => {
        const updated = [...formData.lineItems];
        const item = { ...updated[index], [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
            item.subtotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
        }
        updated[index] = item;
        const { subtotal, totalAmount } = recalculateTotals(updated);
        setFormData(prev => ({ ...prev, lineItems: updated, subtotal, totalAmount }));
    };

    const addLineItem = () => {
        const updated = [
            ...formData.lineItems,
            { description: "", quantity: 1, unitPrice: 0, subtotal: 0 }
        ];
        setFormData(prev => ({ ...prev, lineItems: updated }));
    };

    const removeLineItem = (index: number) => {
        if (formData.lineItems.length === 1) return;
        const updated = formData.lineItems.filter((_, i) => i !== index);
        const { subtotal, totalAmount } = recalculateTotals(updated);
        setFormData(prev => ({ ...prev, lineItems: updated, subtotal, totalAmount }));
    };

    const handleAIGenerate = async () => {
        if (!formData.clientName && !aiPrompt) {
            toast.error("Please provide at least a Client Name or Project Prompt for AI generation.");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/quotations/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    manualDetails: {
                        name: formData.clientName || "Valued Client",
                        email: formData.clientEmail || "client@example.com",
                        company: formData.clientCompany,
                        description: aiPrompt || formData.projectOverview || formData.subject || "Full-stack Web Application",
                        service: "Web & Software Development"
                    }
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to generate quotation with AI");
            }

            const json = await res.json();
            const data = json.data;

            if (data) {
                const items = data.lineItems || formData.lineItems;
                const { subtotal, totalAmount } = recalculateTotals(items, data.taxPercentage || 0, data.discount || 0);

                setFormData(prev => ({
                    ...prev,
                    clientName: data.clientName || prev.clientName,
                    clientEmail: data.clientEmail || prev.clientEmail,
                    clientCompany: data.clientCompany || prev.clientCompany,
                    clientPhone: data.clientPhone || prev.clientPhone,
                    subject: data.subject || prev.subject,
                    projectOverview: data.projectOverview || prev.projectOverview,
                    timeline: data.timeline || prev.timeline,
                    paymentTerms: data.paymentTerms || prev.paymentTerms,
                    exclusions: data.exclusions || prev.exclusions,
                    termsAndConditions: data.termsAndConditions || prev.termsAndConditions,
                    taxPercentage: data.taxPercentage || 0,
                    discount: data.discount || 0,
                    lineItems: items,
                    subtotal: data.subtotal || subtotal,
                    totalAmount: data.totalAmount || totalAmount,
                }));

                toast.success("Quotation drafted with AI successfully!");
            }
        } catch (error: any) {
            console.error("AI Generation Error:", error);
            toast.error(error.message || "Failed to generate quotation with AI");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const createMutation = useMutation({
        mutationFn: async (payload: typeof formData) => {
            const res = await fetch(`${API_BASE_URL}/api/quotations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create quotation");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            toast.success("Quotation created successfully!");
            navigate("/admin/quotations");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to create quotation");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.clientName || !formData.clientEmail) {
            toast.error("Client Name and Client Email are required.");
            return;
        }
        createMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AdminNavbar />

            <div className="container mx-auto p-6 max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/admin/quotations")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotations
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Create Quotation</h1>
                </div>

                {/* AI Assistant Card */}
                <Card className="border-primary/30 bg-primary/5 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                            AI Quotation Generator
                        </CardTitle>
                        <CardDescription>
                            Enter high-level requirements and let Google Gemini automatically draft the line items, scope, and pricing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Textarea
                            placeholder="e.g. Build an e-commerce platform for luxury watch retailer with Next.js, Stripe checkout, customer reviews, and admin dashboard."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            rows={2}
                        />
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={handleAIGenerate}
                                disabled={isGeneratingAI}
                                className="gap-2"
                            >
                                {isGeneratingAI ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Drafting with AI...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" /> Auto-Fill with AI
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quotation Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Client Name *</Label>
                                <Input
                                    id="clientName"
                                    required
                                    value={formData.clientName}
                                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                    placeholder="Acme Corp / John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientEmail">Client Email *</Label>
                                <Input
                                    id="clientEmail"
                                    type="email"
                                    required
                                    value={formData.clientEmail}
                                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientCompany">Company</Label>
                                <Input
                                    id="clientCompany"
                                    value={formData.clientCompany}
                                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                                    placeholder="Acme Global Inc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientPhone">Phone Number</Label>
                                <Input
                                    id="clientPhone"
                                    value={formData.clientPhone}
                                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Project Overview & Scope</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject / Title *</Label>
                                <Input
                                    id="subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="Quotation for Web & Mobile Development"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectOverview">Project Overview</Label>
                                <Textarea
                                    id="projectOverview"
                                    rows={3}
                                    value={formData.projectOverview}
                                    onChange={(e) => setFormData({ ...formData, projectOverview: e.target.value })}
                                    placeholder="Comprehensive outline of project goals and deliverables..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="timeline">Timeline</Label>
                                    <Input
                                        id="timeline"
                                        value={formData.timeline}
                                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Initial Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => setFormData({ ...formData, status: val })}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="sent">Sent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Line Items */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Line Items & Pricing</CardTitle>
                                <CardDescription>Break down individual services and costs.</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="gap-1">
                                <Plus className="h-4 w-4" /> Add Item
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.lineItems.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-3 items-end p-3 border rounded-lg bg-card/50">
                                    <div className="flex-1 space-y-1 w-full">
                                        <Label className="text-xs">Description</Label>
                                        <Input
                                            value={item.description}
                                            onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                                            placeholder="e.g. UI/UX Design System"
                                            required
                                        />
                                    </div>
                                    <div className="w-24 space-y-1">
                                        <Label className="text-xs">Qty</Label>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) => handleLineItemChange(index, "quantity", Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <Label className="text-xs">Unit Price ($)</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={item.unitPrice}
                                            onChange={(e) => handleLineItemChange(index, "unitPrice", Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="w-32 space-y-1">
                                        <Label className="text-xs">Subtotal ($)</Label>
                                        <Input
                                            type="number"
                                            readOnly
                                            value={item.subtotal}
                                            className="bg-muted font-medium"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeLineItem(index)}
                                        disabled={formData.lineItems.length === 1}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            <div className="flex justify-end pt-4 border-t">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-medium">${formData.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Discount ($):</span>
                                        <Input
                                            type="number"
                                            min={0}
                                            className="w-24 h-7 text-right"
                                            value={formData.discount}
                                            onChange={(e) => {
                                                const disc = Number(e.target.value) || 0;
                                                const { totalAmount } = recalculateTotals(formData.lineItems, formData.taxPercentage, disc);
                                                setFormData(prev => ({ ...prev, discount: disc, totalAmount }));
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span className="text-primary">${formData.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Terms & Conditions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="paymentTerms">Payment Terms</Label>
                                <Input
                                    id="paymentTerms"
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exclusions">Exclusions</Label>
                                <Textarea
                                    id="exclusions"
                                    rows={2}
                                    value={formData.exclusions}
                                    onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                                <Textarea
                                    id="termsAndConditions"
                                    rows={2}
                                    value={formData.termsAndConditions}
                                    onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => navigate("/admin/quotations")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending} className="gap-2">
                            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Create Quotation
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuotation;
