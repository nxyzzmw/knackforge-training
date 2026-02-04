import { useMemo, useState } from "react";
import reports from "../../data/reports.json";
import Table, { type TableColumn } from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import "./reports.css";

interface ReportItem {
  id: number;
  title: string;
  month: string;
  status: "Pending" | "Completed";
  createdBy: string;
  date: string;
}

const Reports = () => {
  const [monthFilter, setMonthFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const data: ReportItem[] = reports;

  const months = Array.from(new Set(data.map((r) => r.month)));

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const monthMatch = monthFilter === "All" || r.month === monthFilter;
      const statusMatch = statusFilter === "All" || r.status === statusFilter;
      return monthMatch && statusMatch;
    });
  }, [data, monthFilter, statusFilter]);

  const totalCount = data.length;
  const completedCount = data.filter((r) => r.status === "Completed").length;
  const pendingCount = data.filter((r) => r.status === "Pending").length;

  const columns: TableColumn<ReportItem>[] = [
    { key: "title", header: "Title", accessor: "title" },
    { key: "month", header: "Month", accessor: "month" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge
          label={row.status}
          variant={row.status === "Completed" ? "completed" : "pending"}
        />
      ),
    },
    { key: "createdBy", header: "Created By", accessor: "createdBy" },
    { key: "date", header: "Date", accessor: "date" },
  ];

  const handleExport = (type: "excel" | "pdf") => {
    alert(`Exporting ${type.toUpperCase()}...`);
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="title">Reports</div>
        <div className="reports-controls">
          <select
            className="form-select"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="All">All Months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handleExport("excel")}
                >
                  Export Excel
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handleExport("pdf")}
                >
                  Export PDF
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="reports-summary">
        <div className="summary-card">
          <div className="summary-label">Total Reports</div>
          <div className="summary-value">{totalCount}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Completed</div>
          <div className="summary-value">{completedCount}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Pending</div>
          <div className="summary-value">{pendingCount}</div>
        </div>
      </div>

      <div className="reports-table-wrap">
        <Table columns={columns} data={filtered} emptyMessage="No reports found" />
      </div>
    </div>
  );
};

export default Reports;
