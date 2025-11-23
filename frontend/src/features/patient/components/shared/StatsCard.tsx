import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
}: StatsCardProps) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1 truncate">{title}</p>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{value}</h3>
              {change && (
                <span className={`text-xs sm:text-sm font-medium ${changeColors[changeType]}`}>
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex-shrink-0 rounded-xl ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
