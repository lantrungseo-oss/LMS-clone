"use client"

import * as React from "react"
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter } from "next/navigation"
import qs from "query-string";
import { useDebounce } from "@/hooks/use-debounce"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[];
  totalPage: number;
  pagination: {
    page: number;
    pageSize: number;
  };
  searchStr?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalPage,
  pagination,
  searchStr,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchStrValue, setSearchStrValue] = React.useState(searchStr)
  const debouncedSearchValue = useDebounce(searchStrValue);

  const changePagination = (updatedPagination: PaginationState) => {
    router.push(qs.stringifyUrl({
      url: pathname,
      query: {
        ...searchStr && { searchStr: searchStr },
        page: updatedPagination.pageIndex,
        pageSize: updatedPagination.pageSize,
      }
    }, { skipEmptyString: true, skipNull: true }))
  }

  React.useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        ...debouncedSearchValue && { searchStr: debouncedSearchValue },
        page: 1,
        pageSize: 20,
      }
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  }, [debouncedSearchValue, router, pathname])


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPage,
    onPaginationChange: (paginationUpdater) => {
      let updatedPagination: PaginationState;
      if (typeof paginationUpdater === "function") {
        updatedPagination = paginationUpdater({
          pageIndex: pagination.page,
          pageSize: pagination.pageSize,
        })
      } else {
        updatedPagination = paginationUpdater
      }
      
      if(updatedPagination.pageIndex <= 0 || updatedPagination.pageIndex > totalPage) {
        return;
      }

      return changePagination(updatedPagination)
    },
    state: {
      pagination: {
        pageIndex: pagination.page,
        pageSize: pagination.pageSize,
      }
    },
  })

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Search learning plans...."
          onChange={(event) => setSearchStrValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex-none flex space-x-2">
          <Link href="/learning-plans/create">
            <Button variant='outline'>
              <PlusCircle className="h-4 w-4 mr-2" />
              New plan
            </Button>
          </Link>
          <Link href="/learning-plans/create-with-ai">
            <Button variant='default'>
              <PlusCircle className="h-4 w-4 mr-2" />
              Curate with AI
            </Button>
          </Link>
        </div>
        
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
                  )
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
  )
}
