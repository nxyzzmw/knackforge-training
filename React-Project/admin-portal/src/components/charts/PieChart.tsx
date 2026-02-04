import "./charts.css";

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  title: string;
  data: PieSlice[];
}

const PieChart = ({ title, data }: PieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  let start = 0;
  const gradientStops = data
    .map((item) => {
      const slice = (item.value / total) * 100;
      const from = start;
      const to = start + slice;
      start = to;
      return `${item.color} ${from}% ${to}%`;
    })
    .join(", ");

  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <div className="pie-wrap">
        <div
          className="pie"
          style={{
            background: `conic-gradient(${gradientStops})`,
          }}
        />
        <div className="pie-legend">
          {data.map((item) => (
            <div className="legend-item" key={item.label}>
              <span
                className="legend-color"
                style={{ background: item.color }}
              />
              <span className="legend-label">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
