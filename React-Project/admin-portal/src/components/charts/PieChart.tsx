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

const buildGradientStops = (data: PieSlice[], total: number) => {
  let start = 0;
  return data
    .map((item) => {
      const slice = (item.value / total) * 100;
      const from = start;
      const to = start + slice;
      start = to;
      return `${item.color} ${from}% ${to}%`;
    })
    .join(", ");
};

const PieChart = ({ title, data }: PieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const gradientStops = buildGradientStops(data, total);

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
