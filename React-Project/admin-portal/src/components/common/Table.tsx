import type { ReactNode } from "react";

export interface SimpleColumn {
  key: string;
  header: string;
  className?: string;
  render?: (row: Record<string, string | number>) => ReactNode;
}

interface SimpleTableProps {
  columns: SimpleColumn[];
  data: Array<Record<string, string | number>>;
}

const Table = ({ columns, data }: SimpleTableProps) => {
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
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.key} className={col.className}>
                {col.render ? col.render(row) : row[col.key] ?? "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
