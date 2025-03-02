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
  FastForward,
  Rewind,
  SearchIcon,
  HeartIcon,
  PhoneIcon,
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
import { getPaginationPages } from "~/lib/utils";
import dayjs from "dayjs";


// Helper function to get badge color based on sponsor type
const getSponsorTypeColor = (sponsorType: string) => {
  switch (sponsorType) {
    case "Corporate":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Foundation":
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    case "Individual":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "Government":
      return "bg-amber-100 text-amber-800 border-amber-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Helper function to get tier color
const getTierColor = (tier: string) => {
  switch (tier) {
    case "Platinum":
      return "bg-slate-100 text-slate-800 border-slate-300";
    case "Gold":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Silver":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "Bronze":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Helper function to get CSR interest badge color
const getCSRInterestColor = (csrInterest: string) => {
  return csrInterest === "Yes" 
    ? "bg-green-100 text-green-800 border-green-300"
    : "bg-gray-100 text-gray-800 border-gray-300";
};

const columns: ColumnDef<SponsorMembershipProps>[] = [
  {
    accessorKey: "sponsorName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sponsor Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const sponsorName: string = row.getValue("sponsorName");
      return sponsorName !== "none" ? (
        <div className="font-medium">{sponsorName}</div>
      ) : (
        <div className="italic text-muted-foreground">Not provided</div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "contactPerson",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact Person
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const contactPerson: string = row.getValue("contactPerson");
      return contactPerson !== "none" ? (
        <div>{contactPerson}</div>
      ) : (
        <div className="italic text-muted-foreground">Not provided</div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email: string = row.getValue("email");
      return email ? (
        <div className="truncate max-w-[180px]">
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
            {email}
          </a>
        </div>
      ) : (
        <div className="italic text-muted-foreground">Not provided</div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone: string = row.getValue("phone");
      return phone !== "none" ? (
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-4 w-4 text-slate-600" />
          <span>{phone}</span>
        </div>
      ) : (
        <div className="italic text-muted-foreground">Not provided</div>
      );
    },
  },
  {
    accessorKey: "sponsorType",
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
      const sponsorType: string = row.getValue("sponsorType");
      return sponsorType !== "none" ? (
        <Badge variant="outline" className={getSponsorTypeColor(sponsorType)}>
          {sponsorType}
        </Badge>
      ) : (
        <Badge variant="outline">Not specified</Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "industry",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Industry
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const industry: string = row.getValue("industry");
      return industry !== "none" ? (
        <div>{industry}</div>
      ) : (
        <div className="italic text-muted-foreground">Not specified</div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "tier",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tier
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const tier: string = row.getValue("tier");
      return tier !== "none" ? (
        <Badge variant="outline" className={getTierColor(tier)}>
          {tier}
        </Badge>
      ) : (
        <div className="italic text-muted-foreground">Not specified</div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "budgetRange",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const budget: string = row.getValue("budgetRange");
      return budget !== "none" ? (
        <div>{budget}</div>
      ) : (
        <div className="italic text-muted-foreground">Not specified</div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "focusArea",
    header: "Focus Area",
    cell: ({ row }) => {
      const focusArea: string = row.getValue("focusArea");
      return focusArea !== "none" ? (
        <div>{focusArea}</div>
      ) : (
        <div className="italic text-muted-foreground">Not specified</div>
      );
    },
  },
  {
    accessorKey: "csrInterest",
    header: "CSR Interest",
    cell: ({ row }) => {
      const csrInterest: string = row.getValue("csrInterest");
      return (
        <div className="flex items-center gap-2">
          {csrInterest === "Yes" && <HeartIcon className="h-4 w-4 text-red-500" />}
          <Badge variant="outline" className={getCSRInterestColor(csrInterest)}>
            {csrInterest}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{dayjs(row.getValue("createdAt")).format("DD.MM.YYYY")}</div>;
    },
    enableSorting: true,
  },
];

export const SponsorMembershipTable = () => {
  const [data] = api.member.getSponsorMemberships.useSuspenseQuery();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    phone: false,
    focusArea: false,
  });
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
        <CardTitle>Sponsorship Directory</CardTitle>
        <CardDescription>Browse and manage sponsors</CardDescription>
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
                  placeholder="Filter by sponsor type..."
                  value={
                    (table
                      .getColumn("sponsorType")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("sponsorType")
                      ?.setFilterValue(event.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div className="relative flex-1 md:max-w-xs">
                <Input
                  placeholder="Filter by tier..."
                  value={
                    (table
                      .getColumn("tier")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("tier")
                      ?.setFilterValue(event.target.value)
                  }
                  className="w-full"
                />
              </div>
              <div className="relative flex-1 md:max-w-xs">
                <Input
                  placeholder="Filter by industry..."
                  value={
                    (table
                      .getColumn("industry")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("industry")
                      ?.setFilterValue(event.target.value)
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