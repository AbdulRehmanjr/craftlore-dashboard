"use client";
import { api } from "~/trpc/react";
import { type ColumnDef, type ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Ellipsis, Plus, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import Link from "next/link";
import dayjs from "dayjs";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { DeleteHotelDialog } from "~/components/hotel/deletion";

const columns: ColumnDef<HotelProps>[] = [
    {
        accessorKey: "hotelLogo",
        header: "Hotel logo",
        cell: ({ row }) => (
            <Image
                src={row.getValue("hotelLogo")}
                alt="hotel logo"
                width={64}
                height={64}
            />
        ),
    },
    {
        accessorKey: "code",
        header: "Hotel code",
        cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
        accessorKey: "hotelName",
        header: "Hotel name",
        cell: ({ row }) => <div>{row.getValue("hotelName")}</div>,
    },
    {
        accessorKey: "firstName",
        header: "Manager",
        cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
            return <div>{row.getValue("address")}</div>;
        },
    },
    {
        accessorKey: "island",
        header: "Island",
        cell: ({ row }) => {
            return <div>{row.getValue("island")}</div>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Creation time",
        cell: ({ row }) => {
            return <div>{dayjs(row.getValue("createdAt")).format('DD-MM-YYYY')}</div>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const hotel = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" type="button">
                            <span className="sr-only">Open menu</span>
                            <Ellipsis className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Button variant="outline" className="w-full h-full" asChild>
                                <Link href={`/dashboard/hotel/${hotel.hotelId}`} className="w-full h-full">
                                    Edit
                                </Link>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <DeleteHotelDialog hotelId={hotel.hotelId} hotelCode={hotel.code} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export const HotelTable = () => {

    const [data] = api.hotel.getAllHotelBySellerId.useSuspenseQuery();
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
                        placeholder="Search hotel name"
                        value={
                            (table.getColumn("hotelName")?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn("hotelName")?.setFilterValue(event.target.value)
                        }
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" asChild>
                        <Link href={"/dashboard/hotel/create"}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add hotel
                        </Link>
                    </Button>
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
