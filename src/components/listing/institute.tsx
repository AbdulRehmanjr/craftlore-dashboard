
"use client";
import { api } from "~/trpc/react";
import { type ColumnDef, type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { MoreHorizontal, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { UpdateUserDialog } from "~/components/listing/update-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";


const columns: ColumnDef<InstituteProps>[] = [
    {
        accessorKey: "instituteName",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("instituteName")}</div>,
    },
    {
        accessorKey: "instituteRep",
        header: "Represenative",
        cell: ({ row }) => <div>{row.getValue("instituteRep")}</div>,
    },
    {
        accessorKey: "repDes",
        header: "Designation",
        cell: ({ row }) => <div>{row.getValue("repDes")}</div>,
    },
    {
        accessorKey: "instituteAddress",
        header: "Address",
        cell: ({ row }) => <div>{row.getValue("instituteAddress")} years</div>,
    },
    {
        accessorKey: "instituteEmail",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("instituteEmail")}</div>,
    },
    {
        accessorKey: "instituteType",
        header: "Type",
        cell: ({ row }) => <div>{row.getValue("instituteType")}</div>,
    },
    {
        accessorKey: "instituteMission",
        header: "mission",
        cell: ({ row }) => <div>{row.getValue("instituteMission")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            return <div>{row.getValue("status")}</div>;
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
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <UpdateUserDialog
                    userId={row.original.userId}
                    dialog="institute"
                  />
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

    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="mb-4 flex items-center justify-between gap-4">
            <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search business name"
                        value={
                            (table.getColumn("instituteName")?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn("instituteName")?.setFilterValue(event.target.value)
                        }
                        className="pl-10"
                    />
                </div>
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search address"
                        value={
                            (table.getColumn("instituteAddress")?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn("insttuteAddress")?.setFilterValue(event.target.value)
                        }
                        className="pl-10"
                    />
                </div>
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search email"
                        value={
                            (table.getColumn("instituteEmail")?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn("instituteEmail")?.setFilterValue(event.target.value)
                        }
                        className="pl-10"
                    />
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
