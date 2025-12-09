import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, CheckCircle, XCircle, Clock, Send } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AddAdminDialog from "@/components/AddAdminDialog";

const AdminHome = () => {
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

    const fetchStats = async () => {
        const res = await fetch(`${API_BASE_URL}/api/quotations`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        return data.data; // Assuming this returns all quotations for now
    };

    const { data: quotations, isLoading, error } = useQuery({
        queryKey: ['quotations'],
        queryFn: fetchStats,
        enabled: !!accessToken,
    });

    if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="text-center text-red-500">Error loading dashboard</div>;

    const totalQuotations = quotations?.length || 0;
    const pendingQuotations = quotations?.filter((q: any) => q.status === 'pending').length || 0;
    const approvedQuotations = quotations?.filter((q: any) => q.status === 'approved').length || 0;
    const rejectedQuotations = quotations?.filter((q: any) => q.status === 'rejected').length || 0;
    const sentQuotations = quotations?.filter((q: any) => q.status === 'sent').length || 0;

    const chartData = [
        { name: 'Pending', count: pendingQuotations, color: '#eab308' }, // yellow-500
        { name: 'Approved', count: approvedQuotations, color: '#22c55e' }, // green-500
        { name: 'Rejected', count: rejectedQuotations, color: '#ef4444' }, // red-500
        { name: 'Sent', count: sentQuotations, color: '#3b82f6' }, // blue-500
    ];

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <AddAdminDialog />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalQuotations}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingQuotations}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{approvedQuotations}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{rejectedQuotations}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sent / Delivered</CardTitle>
                            <Send className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{sentQuotations}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Quotation Analytics</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                                        />
                                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
