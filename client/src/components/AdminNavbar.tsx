import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Home, FileText } from "lucide-react";
import SolvifyLogo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { RootState } from "../store/store";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        dispatch(logout());
        await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
        navigate("/");
    };

    return (
        <nav className="border-b border-border bg-card">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/admin" className="flex items-center gap-2">
                        <SolvifyLogo className="w-32 h-auto" />
                        <span className="text-sm font-semibold text-muted-foreground border-l pl-2 ml-2">Admin</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/admin">
                            <Button variant="ghost" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" /> Home
                            </Button>
                        </Link>
                        <Link to="/admin/quotations">
                            <Button variant="ghost" className="gap-2">
                                <FileText className="h-4 w-4" /> Quotations
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="ghost" className="gap-2">
                                <Home className="h-4 w-4" /> View Site
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-sm text-right hidden md:block">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                        <LogOut className="h-5 w-5 text-red-500" />
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
