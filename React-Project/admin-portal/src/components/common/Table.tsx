import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  rowKey?: (row: T, index: number) => string | number;
}

const Table = <T,>({
  columns,
  data,
  emptyMessage = "No records found",
  rowKey,
}: TableProps<T>) => {
  const getKey = rowKey ?? ((row, index) => (row as { id?: number }).id ?? index);

  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={getKey(row, index)}>
            {columns.map((col) => {
              const content = col.render
                ? col.render(row)
                : col.accessor
                  ? String(row[col.accessor] ?? "-")
                  : "-";
              return (
                <td
                  key={col.key}
                  className={col.className}
                  data-label={col.header}
                >
                  {content}
                </td>
              );
            })}
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length} className="empty-row">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
