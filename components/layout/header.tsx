import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">d.</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">1</span>
            </div>
          </div>
          <Settings className="w-5 h-5 text-gray-600" />
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-purple-500 text-white">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
