import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

export type SamplePayment = {
  id: string;
  email: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
};

export const samplePayments: SamplePayment[] = [
  { id: "1", email: "ada@example.com", amount: 120, status: "success" },
  { id: "2", email: "grace@example.com", amount: 80, status: "pending" },
  { id: "3", email: "linus@example.com", amount: 240, status: "processing" },
  { id: "4", email: "tim@example.com", amount: 45, status: "failed" },
  { id: "5", email: "brendan@example.com", amount: 310, status: "success" },
  { id: "6", email: "james@example.com", amount: 150, status: "success" },
  { id: "7", email: "jill@example.com", amount: 95, status: "pending" },
  { id: "8", email: "john@example.com", amount: 200, status: "processing" },
  { id: "9", email: "jane@example.com", amount: 175, status: "success" },
  { id: "10", email: "jack@example.com", amount: 60, status: "failed" },
  { id: "11", email: "joe@example.com", amount: 130, status: "pending" },
  { id: "12", email: "jenny@example.com", amount: 220, status: "success" },
];

export const samplePaymentColumns: ColumnDef<SamplePayment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => row.getValue("email"),
    enableColumnFilter: true,
    meta: { filterPlaceholder: "Filter email…" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.getValue("status"),
    enableColumnFilter: true,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      return `$${amount.toFixed(2)}`;
    },
  },
];
