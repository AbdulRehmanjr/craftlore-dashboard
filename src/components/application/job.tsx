"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowLeft,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Download,
  EyeIcon,
  FastForward,
  FileTextIcon,
  Rewind,
  SearchIcon,
  SlidersHorizontal,
  XIcon,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { getPaginationPages } from "~/lib/utils";

type AppliedJobProps = {
  jobId: string;
  fullName: string;
  email: string;
  job: string;
  jobCode: string;
  resume: string;
  coverLetter: string;
};

// View Resume Dialog Component (You'll need to implement this)
const ViewResumeDialog = ({ resumeUrl }: { resumeUrl: string; applicantName: string }) => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={resumeUrl} target="_blank">
        <FileTextIcon className="mr-2 h-4 w-4" />
        View Resume
      </Link>
    </Button>
  );
};

// View Cover Letter Dialog Component (You'll need to implement this)
const ViewCoverLetterDialog = ({ coverLetterUrl }: { coverLetterUrl: string; applicantName: string }) => {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={coverLetterUrl} target="_blank">
        <FileTextIcon className="mr-2 h-4 w-4" />
        View Cover Letter
      </Link>
    </Button>
  );
};

// Function to truncate email for display
const truncateEmail = (email: string) => {
  if (email.length > 25) {
    return `${email.substring(0, 22)}...`;
  }
  return email;
};

const columns: ColumnDef<AppliedJobProps>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("fullName")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const email: string = row.getValue("email");
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate">{truncateEmail(email)}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "job",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Position
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("job")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "jobCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Code
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
        {row.getValue("jobCode")}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    id: "resume",
    header: "Resume",
    cell: ({ row }) => {
      const resumeUrl = row.original.resume;
      return resumeUrl && resumeUrl !== "none" ? (
        <ViewResumeDialog 
          resumeUrl={resumeUrl} 
          applicantName={row.original.fullName} 
        />
      ) : (
        <div className="italic text-muted-foreground">Not provided</div>
      );
    },
  },
  {
    id: "coverLetter",
    header: "Cover Letter",
    cell: ({ row }) => {
      const coverLetterUrl = row.original.coverLetter;
      return coverLetterUrl && coverLetterUrl !== "none" ? (
        <ViewCoverLetterDialog 
          coverLetterUrl={coverLetterUrl} 
          applicantName={row.original.fullName} 
        />
      ) : (
        <div className="italic text-muted-foreground">Not provided</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/jobs/application?jobId=${row.original.jobId}`}>
                  <EyeIcon className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.resume && row.original.resume !== "none" && (
              <DropdownMenuItem asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link href={row.original.resume} target="_blank" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Resume
                  </Link>
                </Button>
              </DropdownMenuItem>
            )}
            {row.original.coverLetter && row.original.coverLetter !== "none" && (
              <DropdownMenuItem asChild>
                <Button variant="outline" size="sm" asChild>
                  <Link href={row.original.coverLetter} target="_blank" download>
                    <Download className="mr-2 h-4 w-4" />
                    Download Cover Letter
                  </Link>
                </Button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const AppliedJobs = () => {
  const [data] = api.employ.getAppliedJobs.useSuspenseQuery();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>Browse and manage job applications from candidates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative w-full md:max-w-sm">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search all columns..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-8 md:max-w-sm"
                />
                {globalFilter && (
                  <Button
                    variant="ghost"
                    onClick={() => setGlobalFilter("")}
                    className="absolute right-0 top-0 h-9 w-9 p-0"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto flex">
                    Columns <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id.replace(/([A-Z])/g, " $1").trim()}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              <div className="relative flex-1 md:max-w-xs">
                <Input
                  placeholder="Filter by job position..."
                  value={(table.getColumn("job")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("job")?.setFilterValue(event.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div className="relative flex-1 md:max-w-xs">
                <Input
                  placeholder="Filter by job code..."
                  value={(table.getColumn("jobCode")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("jobCode")?.setFilterValue(event.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="my-4 flex items-center justify-between px-2">
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <Rewind className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  {getPaginationPages(
                    table.getPageCount(),
                    table.getState().pagination.pageIndex,
                  ).map((pageIndex) => (
                    <Button
                      key={pageIndex}
                      variant={
                        pageIndex === table.getState().pagination.pageIndex
                          ? "default"
                          : "outline"
                      }
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(pageIndex)}
                    >
                      {pageIndex + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <FastForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};