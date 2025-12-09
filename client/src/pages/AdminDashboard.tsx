import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Search, FileText, DollarSign, Clock, CheckCircle2, XCircle, Filter } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import AddAdminDialog from "@/components/AddAdminDialog";

interface Quotation {
    _id: string;
    quotationId: string;
    clientName: string;
    projectTitle?: string; // Optional in interface based on your schema
    subject: string;
    totalAmount: number;
    status: 'draft' | 'pending' | 'approved' | 'sent' | 'rejected';
    createdAt: string;
}

const AdminDashboard = () => {
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchQuotations = async () => {
        const res = await fetch(`${API_BASE_URL}/api/quotations`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error("Failed to fetch quotations");
        const data = await res.json();
        return data.data;
    };

    const { data: quotations = [], isLoading, error } = useQuery({
        queryKey: ['quotations'],
        queryFn: fetchQuotations,
        enabled: !!accessToken,
    });

    // Compute Stats
    const stats = useMemo(() => {
        if (!quotations.length) return { total: 0, revenue: 0, pending: 0, approved: 0 };
        return {
            total: quotations.length,
            revenue: quotations.reduce((acc: number, curr: Quotation) => acc + (curr.totalAmount || 0), 0),
            pending: quotations.filter((q: Quotation) => q.status === 'pending').length,
            approved: quotations.filter((q: Quotation) => q.status === 'approved').length
        };
    }, [quotations]);

    // Filter Logic
    const filteredQuotations = useMemo(() => {
        return quotations.filter((q: Quotation) => {
            const matchesSearch =
                q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.quotationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.subject.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || q.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [quotations, searchTerm, statusFilter]);

    // Helper for Status Colors
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
            case 'rejected': return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
            case 'sent': return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
            case 'pending': return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="w-3 h-3 mr-1" />;
            case 'rejected': return <XCircle className="w-3 h-3 mr-1" />;
            case 'pending': return <Clock className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
    if (error) return <div className="text-center text-red-500 pt-20">Error loading dashboard data.</div>;

    return (
        <div className="min-h-screen bg-muted/5 flex flex-col">
            <AdminNavbar />

            <main className="container mx-auto p-6 space-y-8 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage quotations and track business overview.</p>
                    </div>
                    <div className="flex gap-3">
                        <AddAdminDialog />
                        <Button onClick={() => navigate('/quotations/new')} className="shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Create Quotation
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quotes</CardTitle>
                            <FileText className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">All time created</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">Requires attention</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.approved}</div>
                            <p className="text-xs text-muted-foreground">Ready for processing</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Content */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search client, ID, or subject..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredQuotations.map((quote: Quotation) => (
                            <Card
                                key={quote._id}
                                className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4"
                                style={{ borderLeftColor: quote.status === 'approved' ? '#22c55e' : quote.status === 'rejected' ? '#ef4444' : quote.status === 'pending' ? '#eab308' : '#3b82f6' }}
                                onClick={() => navigate(`/admin/quotations/${quote._id}`)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-semibold text-primary/90 group-hover:text-primary transition-colors">
                                                {quote.clientName}
                                            </CardTitle>
                                            <CardDescription className="font-mono text-xs mt-1">
                                                {quote.quotationId}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className={`capitalize flex items-center ${getStatusColor(quote.status)}`}>
                                            {getStatusIcon(quote.status)}
                                            {quote.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium line-clamp-1" title={quote.subject}>
                                            {quote.subject}
                                        </div>
                                        <div className="flex justify-between items-end pt-2">
                                            <div className="text-xs text-muted-foreground">
                                                Created on {new Date(quote.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-lg font-bold text-foreground">
                                                ${quote.totalAmount?.toLocaleString() || 0}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredQuotations.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
                            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium">No quotations found</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
                                No results match your search criteria. Try adjusting your filters or create a new quotation.
                            </p>
                            <Button variant="outline" onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;