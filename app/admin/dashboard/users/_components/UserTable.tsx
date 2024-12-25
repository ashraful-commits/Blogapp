"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  CopyMinus,
  EyeIcon,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createdAtByUseer } from "@/utils/createdAtFormat";
import Link from "next/link";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import Swal from "sweetalert2";

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  image: string;
  createdAt: string;
};

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: String!) {
    deleteUser(id: $deleteUserId) {
      id
      email
      name
      image
      createdAt
      role
    }
  }
`;

const UserTable = ({
  data,
  refetch,
}: {
  data: User[];
  refetch: () => void;
}) => {
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE);
  const [deleteUser, {}] = useMutation(DELETE_USER, {
    refetchQueries: ["users"],
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "UserID",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "image",
      header: "User Image",
      cell: ({ row }) => (
        <Image
          src={row.getValue("image")}
          className="rounded-md h-14 object-cover"
          alt="user-image"
          height={30}
          width={75}
        />
      ),
    },
    {
      accessorKey: "name",
      header: "User Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: "User Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const userId = row.original.id;

        return (
          <Select
            value={role}
            onValueChange={(selectedRole) => {
              handleUpdateRole(userId, selectedRole);
            }}
          >
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Update Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">USER</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <div className="capitalize">
          {createdAtByUseer(row.getValue("createdAt"))}
        </div>
      ),
    },
    {
      accessorKey: "id",
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div>
            <Button
              onClick={() => handleDelete(row.getValue("id"))}
              className="mr-1"
              variant="destructive"
              size={"sm"}
            >
              <Trash size={16} />
            </Button>
            <Link href={`/profile/${row.getValue("id")}`}>
              <Button variant="default" size={"sm"}>
                <EyeIcon size={16} />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const handleUpdateRole = (id: string, role: string) => {
    updateUserRole({ variables: { id, role: role } })
      .then(() => {
        toast("Role Updated Successfully", {
          action: {
            label: <CopyMinus size={16} />,
            onClick: () => console.log("Minus"),
          },
        });
        refetch();
      })
      .catch((error) => {
        console.error(`Failed to update role for user ID: ${id}`, error);
      });
  };

  const handleDelete = (id : string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This post will be deleted forever",
      icon: "warning",
      confirmButtonText: "Sure",
      confirmButtonColor: "#d33",
      cancelButtonColor: "",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser({ variables: { deleteUserId: id } })
          .then(() => {
            toast("User Deleted Successfully", {
              action: {
                label: <CopyMinus size={16} />,
                onClick: () => console.log("Minus"),
              },
            });
            refetch();
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
            Swal.fire(
              "Error!",
              "There was a problem deleting the post.",
              "error"
            );
          });
      }
    });
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
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
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
                        cell.getContext()
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
      <div className="flex items-center justify-end space-x-2 py-4">
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

export default UserTable;
