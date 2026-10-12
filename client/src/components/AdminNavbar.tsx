import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Home, FileText, User, PlusCircle } from "lucide-react";
import SolvifyLogo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { RootState } from "../store/store";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        dispatch(logout());
        await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
        navigate("/");
    };

    const isDashboardActive = location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    const isQuotationsActive = location.pathname === '/admin/quotations';
    const isNewQuoteActive = location.pathname === '/admin/quotations/new' || location.pathname === '/quotations/new';

    return (
        <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/admin" className="flex items-center gap-2">
                        <SolvifyLogo className="w-32 h-auto" />
                        <span className="text-xs uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Admin</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/admin">
                            <Button variant={isDashboardActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" /> Dashboard
                            </Button>
                        </Link>
                        <Link to="/admin/quotations">
                            <Button variant={isQuotationsActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                                <FileText className="h-4 w-4" /> Quotations
                            </Button>
                        </Link>
                        <Link to="/admin/quotations/new">
                            <Button variant={isNewQuoteActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                                <PlusCircle className="h-4 w-4" /> New Quote
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                <Home className="h-4 w-4" /> View Site
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-right hidden sm:block">
                        <p className="font-medium text-foreground leading-none">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">{user?.role}</p>
                    </div>
                    <Link to="/profile">
                        <Button variant={location.pathname === "/profile" ? "secondary" : "ghost"} size="icon" title="My Profile">
                            <User className="h-5 w-5" />
                        </Button>
                    </Link>
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
