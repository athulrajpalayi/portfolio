import type { ReactNode } from "react";

import { GlassCard } from "@/components/primitives/glass-card";

type DataTableProps = {
  title: string;
  columns: string[];
  rows: ReactNode[][];
};

export function DataTable({ title, columns, rows }: DataTableProps) {
  return (
    <GlassCard className="rounded-[28px] p-0">
      <div className="border-b border-[rgba(255,255,255,0.08)] px-6 py-5 text-lg font-semibold text-[var(--text-primary)]">
        {title}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)]">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-xs uppercase tracking-[0.32em] text-[var(--text-muted)]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
