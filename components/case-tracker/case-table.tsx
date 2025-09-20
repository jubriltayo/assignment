import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCode } from "country-list";
import { format } from "date-fns";
import type { CaseTableProps } from "@/types/case";

const generateInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const getCountryCode = (country: string): string => {
  try {
    const code = getCode(country);
    return code ? code.toUpperCase() : "XX";
  } catch {
    return "XX";
  }
};
const getStatusColor = (string: string): string => {
  const statusColors: { [key: string]: string } = {
    AWAITING_INFORMATION: "bg-yellow-100 text-yellow-800",
    ELIGIBLE: "bg-green-100 text-green-800",
    IN_REVIEW: "bg-blue-100 text-blue-800",
    APPLICATION_PREPARATION: "bg-purple-100 text-purple-800",
  };
  return statusColors[string] || "bg-gray-100 text-gray-800";
};

const getProgressColor = (status: string): string => {
  const progressColors: { [key: string]: string } = {
    AWAITING_INFORMATION: "bg-yellow-500",
    ELIGIBLE: "bg-green-500",
    IN_REVIEW: "bg-blue-500",
    APPLICATION_PREPARATION: "bg-purple-500",
  };
  return progressColors[status] || "bg-gray-400";
};

const formatCaseType = (caseType: string): string => {
  const caseTypeMap: { [key: string]: string } = {
    SPONSORED_VISA: "Sponsored Visa",
    EOR_VISA: "EOR Visa",
    FAMILY_VISA: "Family Visa",
    STUDENT_VISA: "Student Visa",
  };
  return caseTypeMap[caseType] || caseType;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MMMM do, yyyy");
  } catch {
    return "N/A";
  }
};

export function CaseTable({ cases, loading, error }: CaseTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading cases</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="font-medium">No cases found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">Total {cases.length} cases</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Case Type</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Process Status</TableHead>
            <TableHead>Steps Completed</TableHead>
            <TableHead>Expected Completion Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((case_) => (
            <TableRow key={case_.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                      {generateInitials(case_.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-blue-600">
                    {case_.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>{formatCaseType(case_.caseType)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {getCountryCode(case_.country)}
                  </span>
                  <span className="text-sm text-gray-600">{case_.country}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={`${getStatusColor(
                    case_.processStatus
                  )} text-xs font-medium`}
                >
                  {case_.processStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {case_.stepsCompleted} of {case_.totalSteps}
                    </span>
                  </div>
                  <Progress
                    value={(case_.stepsCompleted / case_.totalSteps) * 100}
                    barColor={getProgressColor(case_.processStatus)}
                    className="h-2"
                  />
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDate(case_.expectedCompletionDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
