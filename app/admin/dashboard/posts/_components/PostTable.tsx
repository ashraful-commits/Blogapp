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
import { ChevronDown, CopyMinus, EyeIcon, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { createdAtByUseer } from "@/utils/createdAtFormat";
import Link from "next/link";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

const deleteImage = async (imageURL: string) => {
  const publicId = imageURL?.split('/').slice(7).join('/').split('.')[0];
  console.log(publicId);
};


export type User = {
  name: string;
  image: string;
};

export type Post = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  user: User;
};

const DELETE_POST_MUTATION = gql`
  mutation DeleteLink($id: String!) {
    deleteLink(id: $id) {
      id
      title
      description
      url
      imageURL
      createdAt
    }
  }
`;

const PostTable = ({
  data,
  refetch,
}: {
  data: Post[];
  refetch: () => void;
}) => {
  const [
    deletePost,
    { data: deletedData },
  ] = useMutation(DELETE_POST_MUTATION);

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "id",
      header: "Post ID",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "imageURL",
      header: "Cover Image",
      cell: ({ row }) => (
        <Image
          src={row.getValue("imageURL")}
          className="rounded-md h-14 object-cover"
          alt="post-image"
          height={30}
          width={75}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return (
          <div className="capitalize max-w-40 line-clamp-2">
            {row.getValue("description")}
          </div>
        );
      },
    },
    {
      accessorKey: "categories",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("categories")}</div>
      ),
    },
    {
      accessorKey: "user",
      header: "Authore",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Image
            src={row.original?.user?.image}
            alt="authore-image"
            className="w-10 h-10 rounded-full"
            width={20}
            height={20}
          />
          <div className="capitalize">{row.original?.user?.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Posted At",
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
              onClick={() => handleDeletePost(row.getValue("id"))}
              className="mr-1"
              variant="destructive"
              size={"sm"}
            >
              <Trash size={16} />
            </Button>
            <Link href={`/blogs/${row.getValue("id")}`}>
              <Button variant="default" size={"sm"}>
                <EyeIcon size={16} />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  const handleDeletePost = (id: string) => {
    if (!id || id === undefined) {
      console.error("Invalid ID:", id);
      return;
    }

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
        deletePost({ variables: { id: id } })
          .then(() => {
            deleteImage(deletedData?.deleteLink?.imageURL);

            toast("Post Deleted Successfully", {
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

  // Set initial sorting to sort by "createdAt" descending
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
        <div className="flex-1 text-sm text-muted-foreground">
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

export default PostTable;
