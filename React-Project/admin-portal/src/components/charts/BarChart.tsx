import "./charts.css";

interface MonthBar {
  label: string;
  completed: number;
  pending: number;
}

interface BarChartProps {
  title: string;
  data: MonthBar[];
}

const BarChart = ({ title, data }: BarChartProps) => {
  const maxValue = Math.max(
    1,
    ...data.map((d) => Math.max(d.completed, d.pending))
  );

  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <div className="bar-legend">
        <span className="legend-item">
          <span className="legend-color completed" />
          Completed
        </span>
        <span className="legend-item">
          <span className="legend-color pending" />
          Pending
        </span>
      </div>

      <div className="bar-grid">
        {data.map((item) => (
          <div className="bar-group" key={item.label}>
            <div className="bar-stack">
              <div
                className="bar completed"
                style={{ height: `${(item.completed / maxValue) * 100}%` }}
                title={`Completed: ${item.completed}`}
              />
              <div
                className="bar pending"
                style={{ height: `${(item.pending / maxValue) * 100}%` }}
                title={`Pending: ${item.pending}`}
              />
            </div>
            <div className="bar-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
