"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Search,
  Calendar,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;
  status: string;
  fileUrl: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function AssignmentsManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/admin/assignments");
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    assignmentId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch("/api/admin/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Assignment status updated successfully",
        });
        fetchAssignments();
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Failed to update assignment status:", error);
      toast({
        title: "Error",
        description: "Failed to update assignment status",
        variant: "destructive",
      });
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || assignment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-900">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border border-orange-200 dark:border-orange-900">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge
            variant="default"
            className="border-gray-300 dark:border-gray-700"
          >
            {status}
          </Badge>
        );
    }
  };

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    inProgress: assignments.filter((a) => a.status === "in_progress").length,
    completed: assignments.filter((a) => a.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <Card className="p-6">
          <div className="space-y-4">
            {Array.from(
              { length: 5 },
              (_, i) => `skeleton-${Date.now()}-${i}`
            ).map((key) => (
              <div
                key={key}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Assignments Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View and manage all student assignments
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pending}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                In Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.inProgress}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completed}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {assignment.user.name?.charAt(0) ||
                          assignment.user.email.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {assignment.user.name || "No name"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {assignment.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs truncate">
                      {assignment.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className="border-gray-300 dark:border-gray-700"
                    >
                      {assignment.subject}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(assignment.deadline).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAssignment(assignment)}
                        className="border-blue-300 dark:border-blue-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Select
                        value={assignment.status}
                        onValueChange={(value) => {
                          handleStatusChange(assignment.id, value);
                        }}
                      >
                        <SelectTrigger className="w-[120px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* View Assignment Dialog */}
      <Dialog
        open={!!selectedAssignment}
        onOpenChange={() => setSelectedAssignment(null)}
      >
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {selectedAssignment?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Submitted by{" "}
              {selectedAssignment?.user.name || selectedAssignment?.user.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Description
              </p>
              <p className="text-gray-900 dark:text-white">
                {selectedAssignment?.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Subject
                </p>
                <Badge
                  variant="default"
                  className="border-gray-300 dark:border-gray-700"
                >
                  {selectedAssignment?.subject}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Status
                </p>
                {selectedAssignment &&
                  getStatusBadge(selectedAssignment.status)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Deadline
                </p>
                <p className="text-gray-900 dark:text-white">
                  {selectedAssignment &&
                    new Date(selectedAssignment.deadline).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Submitted
                </p>
                <p className="text-gray-900 dark:text-white">
                  {selectedAssignment &&
                    new Date(selectedAssignment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {selectedAssignment?.fileUrl && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Submitted File
                </p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedAssignment.fileUrl.split("/").pop()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click download to view the file
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedAssignment.fileUrl!;
                      link.download =
                        selectedAssignment.fileUrl!.split("/").pop() || "file";
                      link.target = "_blank";
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    className="border-blue-300 dark:border-blue-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
