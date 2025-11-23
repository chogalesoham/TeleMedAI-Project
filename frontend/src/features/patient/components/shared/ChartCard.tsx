import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const ChartCard = ({ title, description, children, action }: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">{title}</CardTitle>
              {description && <CardDescription className="mt-0.5 sm:mt-1 text-xs sm:text-sm truncate">{description}</CardDescription>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">{children}</CardContent>
      </Card>
    </motion.div>
  );
};
