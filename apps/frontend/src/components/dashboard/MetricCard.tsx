interface MetricCardProps {
  label: string;
  value: string | number;
  color?: 'green' | 'red' | 'default';
}

export function MetricCard({ label, value, color = 'default' }: MetricCardProps) {
  const colorMap = {
    default: 'text-gray-900',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
    </div>
  );
}