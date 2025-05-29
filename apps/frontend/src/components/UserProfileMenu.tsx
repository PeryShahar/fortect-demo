import { FC } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuth } from "@/lib/auth";

const UserProfileMenu: FC = () => {
  const { logout } = useAuth();

  const user = {
    name: "mindra member",
    email: "example@gmail.com",
  };
  const initial = user.name.charAt(0);

  return (
    <div className="flex items-center">
      {/* desktop / md+ profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded="false"
            className="outline-none"
          >
            <div className="text-cyan-700 hover:text-cyan-800 drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] cursor-pointer">
              <Avatar className="w-8 h-8 border-2 border-cyan-700 bg-transparent text-cyan-700">
                <AvatarFallback className="flex items-center justify-center">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileMenu;
