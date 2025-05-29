import { useAuth } from "@/lib/auth";
import UserProfileMenu from "./UserProfileMenu";
import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center py-4 md:py-6">
        {/* Logo and Title */}
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2">
            <img
              src="/mindra-logo.png"
              alt="Mindra Logo"
              width="32"
              height="32"
              className="rounded-lg"
              style={{ color: "transparent" }}
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 font-bold text-2xl">
              MINDRA
            </span>
          </a>
        </div>

        {/* Navigation Links */}
        {isAuthenticated ? (
          <nav className="shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <UserProfileMenu />
            </div>
          </nav>
        ) : (
          <nav className="md:flex items-center space-x-8">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/login" })}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
