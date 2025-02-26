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
  BuildingIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FastForward,
  GraduationCapIcon,
  MailIcon,
  MapPinIcon,
  Rewind,
  SchoolIcon,
  SearchIcon,
  SlidersHorizontal,
  UserIcon,
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
import { UpdateUserDialog } from "~/components/listing/dialogs/update-user";
import { DeleteInstituteDialog } from "~/components/listing/dialogs/delete-institute";
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
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { InstitutionType } from "@prisma/client";
import Link from "next/link";



const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "inactive":
      return "bg-red-100 text-red-800 border-red-300";
    case "suspended":
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-blue-100 text-blue-800 border-blue-300";
  }
};

const getInstitutionTypeIcon = (type: InstitutionType) => {
  switch (type) {
    case InstitutionType.Governance:
      return BuildingIcon;
    case InstitutionType.NGO:
      return BuildingIcon;
    case InstitutionType.Training_Body:
      return GraduationCapIcon;
    case InstitutionType.Educational_Body:
      return SchoolIcon;
    default:
      return BuildingIcon;
  }
};

const getInstitutionTypeColor = (type: InstitutionType) => {
  switch (type) {
    case InstitutionType.Governance:
      return "bg-amber-100 text-amber-800 border-amber-300";
    case InstitutionType.NGO:
      return "bg-green-100 text-green-800 border-green-300";
    case InstitutionType.Training_Body:
      return "bg-blue-100 text-blue-800 border-blue-300";
    case InstitutionType.Educational_Body:
      return "bg-purple-100 text-purple-800 border-purple-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getInstitutionTypeFormat = (type: InstitutionType) => {
  switch (type) {
    case InstitutionType.Governance:
      return "Governance";
    case InstitutionType.NGO:
      return "NGO";
    case InstitutionType.Training_Body:
      return "Training Body";
    case InstitutionType.Educational_Body:
      return "Eductional Body";
    default:
      return "None";
  }
};
const getPaginationPages = (totalPages: number, currentPage: number) => {
  const maxPages = 5;
  let startPage = Math.max(0, currentPage - Math.floor(maxPages / 2));
  const endPage = Math.min(totalPages - 1, startPage + maxPages - 1);

  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(0, endPage - maxPages + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );
};

const columns: ColumnDef<InstituteProps>[] = [
  {
    accessorKey: "instituteName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Institute Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("instituteName")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "instituteRep",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Representative
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <UserIcon className="h-4 w-4 text-gray-500" />
        <span>{row.getValue("instituteRep")}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "repDes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Designation
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-sm">{row.getValue("repDes")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "instituteAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const address :string = row.getValue("instituteAddress");
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 max-w-[200px] truncate">
                <MapPinIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="truncate">{address}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{address}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "instituteEmail",
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
      const  email : string = row.getValue("instituteEmail");
      return (
        <div className="flex items-center gap-2">
          <MailIcon className="h-4 w-4 text-gray-500" />
          <div className="max-w-[180px] truncate">{email}</div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "instituteType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const type  :InstitutionType= row.getValue("instituteType");
      const Icon = getInstitutionTypeIcon(type);
      return (
        <Badge variant="outline" className={getInstitutionTypeColor(type)}>
          <Icon className="mr-1 h-3 w-3" />
          {getInstitutionTypeFormat(type)}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "instituteMission",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mission
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const mission :string = row.getValue("instituteMission");
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[150px] truncate text-sm">{mission}</div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{mission}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status:string = row.getValue("status");
      return (
        <Badge variant="outline" className={getStatusColor(status)}>
          {status}
        </Badge>
      );
    },
    enableSorting: true,
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
              <Button variant="outline" asChild>
                <Link
                  href={`/dashboard/listing/institute?instituteId=${row.original.instituteId}`}
                >
                  Detail
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem asChild>
              <UpdateUserDialog userId={row.original.userId} dialog="institute"/>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteInstituteDialog instituteId={row.original.instituteId}/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const InstituteTable = () => {
  const [data] = api.listing.getInstitutes.useSuspenseQuery();
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
        <CardTitle>Institution Directory</CardTitle>
        <CardDescription>Browse and manage registered institutions</CardDescription>
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
                          {column.id === "instituteName"
                            ? "Institute Name"
                            : column.id === "instituteRep"
                            ? "Representative"
                            : column.id === "repDes"
                            ? "Designation"
                            : column.id === "instituteAddress"
                            ? "Address"
                            : column.id === "instituteEmail"
                            ? "Email"
                            : column.id === "instituteType"
                            ? "Type"
                            : column.id === "instituteMission"
                            ? "Mission"
                            : column.id.replace(/([A-Z])/g, " $1").trim()}
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
                  placeholder="Filter by name..."
                  value={
                    (table
                      .getColumn("instituteName")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("instituteName")
                      ?.setFilterValue(event.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div className="relative flex-1 md:max-w-xs">
                <Select
                  value={(table.getColumn("instituteType")?.getFilterValue() as string) ?? ""}
                  onValueChange={(value) =>
                    table.getColumn("instituteType")?.setFilterValue(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value={InstitutionType.NGO}>NGO</SelectItem>
                    <SelectItem value={InstitutionType.Governance}>Governance</SelectItem>
                    <SelectItem value={InstitutionType.Training_Body}>Training Body</SelectItem>
                    <SelectItem value={InstitutionType.Educational_Body}>Educational Body</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative flex-1 md:max-w-xs">
                <Input
                  placeholder="Filter by status..."
                  value={
                    (table.getColumn("status")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("status")?.setFilterValue(event.target.value)
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
                      No results found.
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