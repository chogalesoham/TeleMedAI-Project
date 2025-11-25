import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { RevenueBarChart, PaymentPieChart } from '../components/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const Revenue = () => {
  const revenueStats = [
    {
      title: 'Total Revenue',
      value: '$124,567',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'This Month',
      value: '$45,678',
      change: '+8.3%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'This Week',
      value: '$12,345',
      change: '-2.4%',
      isPositive: false,
      icon: TrendingDown,
    },
    {
      title: 'Today',
      value: '$2,890',
      change: '+15.2%',
      isPositive: true,
      icon: Calendar,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      patient: 'John Doe',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-25',
      amount: 150,
      status: 'completed',
      type: 'Video Consultation',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Brown',
      date: '2024-01-25',
      amount: 200,
      status: 'completed',
      type: 'Specialist Consultation',
    },
    {
      id: 3,
      patient: 'Robert Johnson',
      doctor: 'Dr. Emily Davis',
      date: '2024-01-24',
      amount: 150,
      status: 'pending',
      type: 'Video Consultation',
    },
    {
      id: 4,
      patient: 'Maria Garcia',
      doctor: 'Dr. James Wilson',
      date: '2024-01-24',
      amount: 175,
      status: 'completed',
      type: 'Follow-up',
    },
    {
      id: 5,
      patient: 'David Lee',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-23',
      amount: 150,
      status: 'refunded',
      type: 'Video Consultation',
    },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 45678, expenses: 32000, profit: 13678 },
    { month: 'Feb', revenue: 52341, expenses: 35000, profit: 17341 },
    { month: 'Mar', revenue: 48902, expenses: 33000, profit: 15902 },
    { month: 'Apr', revenue: 56234, expenses: 38000, profit: 18234 },
    { month: 'May', revenue: 61234, expenses: 40000, profit: 21234 },
    { month: 'Jun', revenue: 58901, expenses: 39000, profit: 19901 },
  ];

  const paymentMethodsData = [
    { name: 'Credit Card', value: 65, amount: 80968, color: '#2563eb' },
    { name: 'Debit Card', value: 25, amount: 31142, color: '#10b981' },
    { name: 'Digital Wallet', value: 10, amount: 12457, color: '#8b5cf6' },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
            Revenue Analytics
          </h1>
          <p className="text-gray-500 mt-1">Track and analyze revenue streams</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </motion.div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span
                    className={`text-sm font-medium flex items-center ${
                      stat.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueBarChart data={monthlyRevenue} height={350} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono">#{transaction.id.toString().padStart(4, '0')}</TableCell>
                      <TableCell className="font-medium">{transaction.patient}</TableCell>
                      <TableCell>{transaction.doctor}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${transaction.amount}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <PaymentPieChart data={paymentMethodsData} height={250} />

              {/* Legend Cards */}
              <div className="flex flex-col justify-center gap-3">
                {paymentMethodsData.map((method) => (
                  <div
                    key={method.name}
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    style={{ borderLeftColor: method.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{method.name}</p>
                        <p className="text-xl font-bold mt-1">{method.value}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold" style={{ color: method.color }}>
                          ${method.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
