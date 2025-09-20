import { ArrowLeft } from "lucide-react";

export function Navigation() {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <ArrowLeft className="w-4 h-4 text-gray-600" />
      <span className="text-gray-600 text-sm">Back to Immigration</span>
    </div>
  );
}
