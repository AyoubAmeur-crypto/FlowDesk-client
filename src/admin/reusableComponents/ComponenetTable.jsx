// ComponenetTable.jsx - Fixed version with proper mobile scrolling

import React from "react"
import { clsx } from "clsx"

const TableRoot = React.forwardRef(({ className, children, ...props }, forwardedRef) => (
  <div ref={forwardedRef}>
    <div
      // IMPORTANT: This is what makes mobile scrolling work
      className={clsx("w-full overflow-x-auto", className)}
      {...props}
    >
      {children}
    </div>
  </div>
))

TableRoot.displayName = "TableRoot"

const Table = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <table
    ref={forwardedRef}
    tremor-id="tremor-raw"
    className={clsx(
      // base - Use min-w-full instead of w-full to allow scrolling
      "w-full caption-bottom border-b",
      // border color
      "border-gray-200",
      className,
    )}
    {...props}
  />
))

Table.displayName = "Table"

const TableHead = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <thead ref={forwardedRef} className={clsx(className)} {...props} />
))

TableHead.displayName = "TableHead"

const TableHeaderCell = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <th
    ref={forwardedRef}
    className={clsx(
      // base - Add whitespace-nowrap to prevent text wrapping
      "border-b px-4 py-3.5 text-left text-sm font-semibold whitespace-nowrap",
      // text color
      "text-gray-900",
      // border color
      "border-gray-200",
      className,
    )}
    {...props}
  />
))

TableHeaderCell.displayName = "TableHeaderCell"

const TableBody = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <tbody
    ref={forwardedRef}
    className={clsx(
      // base
      "divide-y",
      // divide color
      "divide-gray-200",
      className,
    )}
    {...props}
  />
))

TableBody.displayName = "TableBody"

const TableRow = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <tr
    ref={forwardedRef}
    className={clsx(
      "[&_td:last-child]:pr-4 [&_th:last-child]:pr-4",
      "[&_td:first-child]:pl-4 [&_th:first-child]:pl-4",
      className,
    )}
    {...props}
  />
))

TableRow.displayName = "TableRow"

const TableCell = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <td
    ref={forwardedRef}
    className={clsx(
      // base - Add whitespace-nowrap to prevent cell content wrapping
      "p-4 text-sm whitespace-nowrap",
      // text color
      "text-gray-600 dark:text-gray-400",
      className,
    )}
    {...props}
  />
))

TableCell.displayName = "TableCell"

const TableFoot = React.forwardRef(({ className, ...props }, forwardedRef) => {
  return (
    <tfoot
      ref={forwardedRef}
      className={clsx(
        // base
        "border-t text-left font-medium",
        // text color
        "text-gray-900",
        // border color
        "border-gray-200",
        className,
      )}
      {...props}
    />
  )
})

TableFoot.displayName = "TableFoot"

const TableCaption = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <caption
    ref={forwardedRef}
    className={clsx(
      // base
      "mt-3 px-3 text-center text-sm",
      // text color
      "text-gray-500",
      className,
    )}
    {...props}
  />
))

TableCaption.displayName = "TableCaption"

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
}