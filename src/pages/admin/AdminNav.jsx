import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const AdminNav = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const logoutSession = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        cookies.remove("auth.session-token", { path: "/" });
      } catch (error) {
        console.error("Failed to Logout:", error);
      }
      navigate("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-8 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Admin</h1>
          {/* <span className="text-xs text-muted-foreground">Admin</span> */}
        </div>

        <nav className="flex items-center gap-2">
          {/* <Button variant="ghost" size="sm" asChild>
            <NavLink to="/admin-blog-dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </NavLink>
          </Button> */}

          <Button variant="outline" size="sm" asChild>
            <NavLink to="/admin-blog-dashboard/insertblog">
              <Plus className="mr-2 h-4 w-4" />
              Add Blog
            </NavLink>
          </Button>

          <Button className="bg-brand" size="sm" onClick={logoutSession}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNav;
