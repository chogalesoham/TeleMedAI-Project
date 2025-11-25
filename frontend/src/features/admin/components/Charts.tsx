import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    appointments?: number;
  }>;
  height?: number;
}

export const RevenueChart = ({ data, height = 300 }: RevenueChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          fillOpacity={1}
          fill="url(#colorRevenue)"
          name="Revenue ($)"
        />
        {data[0]?.appointments && (
          <Area
            type="monotone"
            dataKey="appointments"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorAppointments)"
            name="Appointments"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface BarChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses?: number;
    profit?: number;
  }>;
  height?: number;
}

export const RevenueBarChart = ({ data, height = 350 }: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value) => `$${Number(value).toLocaleString()}`}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} name="Revenue" />
        {data[0]?.expenses && (
          <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} name="Expenses" />
        )}
        {data[0]?.profit && (
          <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} name="Profit" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

interface PieChartData {
  name: string;
  value: number;
  amount: number;
  color: string;
}

interface PaymentPieChartProps {
  data: PieChartData[];
  height?: number;
}

export const PaymentPieChart = ({ data, height = 250 }: PaymentPieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props: any) => [
            `$${props.payload.amount.toLocaleString()}`,
            name,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface LineChartProps {
  data: Array<{
    date: string;
    value: number;
    label?: string;
  }>;
  height?: number;
  color?: string;
  dataKey?: string;
}

export const TrendLineChart = ({
  data,
  height = 200,
  color = '#2563eb',
  dataKey = 'value',
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
