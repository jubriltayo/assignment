"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useCaseStore } from "@/store/case-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Case, ProcessStatus } from "@/types/case";

interface CaseOverviewProps {
  case: Case;
}

const formatCaseType = (caseType: string): string => {
  const caseTypeMap: { [key: string]: string } = {
    SPONSORED_VISA: "Sponsored Visa",
    EOR_VISA: "EOR Visa",
    FAMILY_VISA: "Family Visa",
    STUDENT_VISA: "Student Visa",
  };
  return caseTypeMap[caseType] || caseType;
};

const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    APPLICATION_PREPARATION: "bg-yellow-100 text-yellow-800",
    DOCUMENT_COLLECTION: "bg-blue-100 text-blue-800",
    GOVERNMENT_PROCESSING: "bg-purple-100 text-purple-800",
    AWAITING_INFORMATION: "bg-orange-100 text-orange-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const processStatuses = [
  { value: "APPLICATION_PREPARATION", label: "Application Preparation" },
  { value: "DOCUMENT_COLLECTION", label: "Document Collection" },
  { value: "GOVERNMENT_PROCESSING", label: "Government Processing" },
  { value: "AWAITING_INFORMATION", label: "Awaiting Information" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export function CaseOverview({ case: caseData }: CaseOverviewProps) {
  const router = useRouter();
  const { updateCase, deleteCase, isLoading } = useCaseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedStatus, setEditedStatus] = useState<ProcessStatus>(
    caseData.processStatus
  );
  const [editedSteps, setEditedSteps] = useState(caseData.stepsCompleted);

  const progress = (caseData.stepsCompleted / caseData.totalSteps) * 100;

  const handleSave = async () => {
    try {
      await updateCase(caseData.id, {
        processStatus: editedStatus,
        stepsCompleted: editedSteps,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating case:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCase(caseData.id);
      router.push("/");
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  const handleCancel = () => {
    setEditedStatus(caseData.processStatus);
    setEditedSteps(caseData.stepsCompleted);
    setIsEditing(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {caseData.name}
            </h1>
            <p className="text-gray-500 mt-1">Case ID: {caseData.id}</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <Badge className={getStatusColor(caseData.processStatus)}>
            {formatStatus(caseData.processStatus)}
          </Badge>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Case Progress</CardTitle>
            <CardDescription>
              {caseData.stepsCompleted} of {caseData.totalSteps} steps completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {Math.round(progress)}% Complete
                </span>
                <span className="font-medium text-gray-900">
                  {caseData.stepsCompleted}/{caseData.totalSteps} Steps
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Case Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Case Type</p>
                  <p className="text-base text-gray-900">
                    {formatCaseType(caseData.caseType)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Destination Country
                  </p>
                  <p className="text-base text-gray-900">{caseData.country}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Expected Completion
                  </p>
                  <p className="text-base text-gray-900">
                    {caseData.expectedCompletionDate
                      ? format(
                          new Date(caseData.expectedCompletionDate),
                          "MMMM dd, yyyy"
                        )
                      : "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Created Date
                  </p>
                  <p className="text-base text-gray-900">
                    {format(new Date(caseData.createdAt), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Process Status
                </label>
                {isEditing ? (
                  <Select
                    value={editedStatus}
                    onValueChange={(value) =>
                      setEditedStatus(value as ProcessStatus)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {processStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-base text-gray-900 py-2">
                    {formatStatus(caseData.processStatus)}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Steps Completed
                </label>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={0}
                      max={caseData.totalSteps}
                      value={editedSteps}
                      onChange={(e) =>
                        setEditedSteps(parseInt(e.target.value) || 0)
                      }
                      disabled={isLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="text-gray-500">
                      / {caseData.totalSteps}
                    </span>
                  </div>
                ) : (
                  <p className="text-base text-gray-900 py-2">
                    {caseData.stepsCompleted} / {caseData.totalSteps}
                  </p>
                )}
              </div>

              {caseData.processStatus === "APPROVED" && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Case Approved
                  </span>
                </div>
              )}

              {caseData.processStatus === "REJECTED" && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <X className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-800">
                    Case Rejected
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timeline Card */}
        <Card>
          <CardHeader>
            <CardTitle>Case Timeline</CardTitle>
            <CardDescription>Track the progress of this case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Case Created
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(caseData.createdAt),
                      "MMMM dd, yyyy • h:mm a"
                    )}
                  </p>
                </div>
              </div>

              {caseData.stepsCompleted > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Progress Updated
                    </p>
                    <p className="text-sm text-gray-500">
                      {caseData.stepsCompleted} of {caseData.totalSteps} steps
                      completed
                    </p>
                  </div>
                </div>
              )}

              {caseData.processStatus === "APPROVED" && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Case Approved
                    </p>
                    <p className="text-sm text-gray-500">
                      Application successfully approved
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              case for <span className="font-semibold">{caseData.name}</span>{" "}
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Case"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
