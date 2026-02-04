interface BadgeProps {
  label: string;
  variant: "pending" | "completed" | "info";
}

const Badge = ({ label, variant }: BadgeProps) => {
  return <span className={`status-badge status-${variant}`}>{label}</span>;
};

export default Badge;
