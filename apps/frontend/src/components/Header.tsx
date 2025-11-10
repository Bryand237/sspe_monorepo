// import usePathname from "@/stores/usePathname";
import { ChevronRight, LogOut, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  // const title = usePathname((state) => state.title);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Générer le breadcrumb à partir du pathname
  const pathSegments = location.pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => {
      // Capitalize first letter and replace dashes/underscores
      const label = segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        label,
        path: "/" + arr.slice(0, index + 1).join("/"),
        isLast: index === arr.length - 1,
      };
    });

  return (
    <div className="w-full h-16 shadow border-1 p-4 rounded-md flex items-center justify-between">
      <div className="flex items-center gap-2 flex-wrap">
        {pathSegments.length === 1 ? (
          <h1 className="text-xl md:text-2xl font-semibold">{pathSegments[0].label}</h1>
        ) : pathSegments.length > 1 ? (
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            {pathSegments.map((segment) => (
              <div key={segment.path} className="flex items-center gap-1">
                <span
                  className={
                    segment.isLast ? "font-medium text-foreground" : ""
                  }
                >
                  {segment.label}
                </span>
                {!segment.isLast && <ChevronRight className="w-3 h-3" />}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:inline-block font-medium">{user?.username}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>{user?.username}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
