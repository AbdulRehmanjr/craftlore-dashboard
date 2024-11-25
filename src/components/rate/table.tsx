"use client";
import { api } from "~/trpc/react";
import Link from "next/link";
import { type ColumnDef, type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Ellipsis, Plus, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { RateStatusToggle } from "~/components/rate/toggle";
import { DeleteRatePlan } from "~/components/rate/deletion";

const columns: ColumnDef<RatePlanDetailProps>[] = [
    {
        accessorKey: "name",
        header: "Rate name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "code",
        header: "Rate code",
        cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
        accessorKey: "hotelName",
        header: "Hotel name",
        cell: ({ row }) => {
            const hotel = row.original.hotel.hotelName;
            return <div className="font-medium">{hotel}</div>;
        },
    },
    {
        accessorKey: "mealId",
        header: "Meal id",
        cell: ({ row }) => <div>{row.getValue("mealId")}</div>,
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            return (
                <Badge variant={row.original.isActive ? "default" : "outline"}>
                    {row.original.isActive ? "Active" : "Deactive"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const rate = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Button variant={"outline"} className="h-full w-full" asChild>
                                <Link
                                    href={`/dashboard/rate/${rate.ratePlanId}`}
                                    className="h-full w-full"
                                >
                                    Edit
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Button variant={"outline"} className="h-full w-full" asChild>
                                <Link
                                    href={`/dashboard/rate/assign?rateId=${rate.ratePlanId}`}
                                    className="h-full w-full"
                                >
                                    Assign to rooms
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <RateStatusToggle
                                rateId={rate.ratePlanId}
                                rateCode={rate.code}
                                status={rate.isActive}
                                hotelCode={rate.hotel.code}
                            />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <DeleteRatePlan
                                rateId={rate.ratePlanId}
                                rateCode={rate.code}
                                hotelCode={rate.hotel.code}
                            />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const RateTable = () => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const [data] = api.rateplan.getRatePlanBySellerId.useSuspenseQuery();

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
        <div className="flex  w-full flex-col gap-3">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search rate name"
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" asChild>
                        <Link href={"/dashboard/rate/create"}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add rate
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="rounded-md border bg-white shadow">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
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
