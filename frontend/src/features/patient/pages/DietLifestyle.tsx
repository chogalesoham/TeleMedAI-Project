import { motion } from 'framer-motion';
import { 
  Apple, 
  Activity, 
  Droplet, 
  Moon, 
  TrendingUp,
  Plus,
  CheckCircle2,
  Clock,
  Flame
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDietPlans } from '../data/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartCard } from '../components/shared/ChartCard';

const nutritionData = [
  { day: 'Mon', calories: 1850 },
  { day: 'Tue', calories: 2100 },
  { day: 'Wed', calories: 1920 },
  { day: 'Thu', calories: 2050 },
  { day: 'Fri', calories: 1890 },
  { day: 'Sat', calories: 2200 },
  { day: 'Sun', calories: 1950 },
];

const exercises = [
  { id: '1', name: 'Morning Walk', duration: '30 mins', calories: 150, completed: true },
  { id: '2', name: 'Yoga Session', duration: '20 mins', calories: 80, completed: true },
  { id: '3', name: 'Evening Jog', duration: '25 mins', calories: 200, completed: false },
];

export const DietLifestyle = () => {
  const todayCalories = 1450;
  const targetCalories = 2000;
  const waterIntake = 6;
  const waterTarget = 8;
  const sleepHours = 7.5;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Diet & Lifestyle</h1>
        <p className="text-sm sm:text-base text-gray-600">Track your nutrition, exercise, and healthy habits</p>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <Badge variant="secondary" className="text-[10px] sm:text-xs">{Math.round((todayCalories / targetCalories) * 100)}%</Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Calories Today</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
              {todayCalories} <span className="text-[10px] sm:text-xs md:text-sm font-normal text-gray-500">/ {targetCalories}</span>
            </p>
            <Progress value={(todayCalories / targetCalories) * 100} className="h-1.5 sm:h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Droplet className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="text-[10px] sm:text-xs">{waterIntake}/{waterTarget}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Water Intake</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">{waterIntake * 250}ml</p>
            <Progress value={(waterIntake / waterTarget) * 100} className="h-1.5 sm:h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <Badge variant="secondary" className="text-[10px] sm:text-xs">2/3</Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Exercise Goals</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">430 cal</p>
            <Progress value={67} className="h-1.5 sm:h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <Badge variant={sleepHours >= 7 ? 'default' : 'secondary'} className="text-[10px] sm:text-xs">
                {sleepHours >= 7 ? 'Good' : 'Low'}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Sleep Last Night</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">{sleepHours}h</p>
            <Progress value={(sleepHours / 8) * 100} className="h-1.5 sm:h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Diet Plans */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Apple className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span>Today's Meal Plan</span>
                </h3>
                <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Add Meal
                </Button>
              </div>

              <Tabs defaultValue="plan" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="plan" className="text-xs sm:text-sm">Meal Plan</TabsTrigger>
                  <TabsTrigger value="nutrition" className="text-xs sm:text-sm">Nutrition</TabsTrigger>
                </TabsList>

                <TabsContent value="plan" className="space-y-2 sm:space-y-3">
                  {mockDietPlans.map((meal, index) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <Badge variant="secondary" className="mb-1.5 sm:mb-2 capitalize text-[10px] sm:text-xs">
                            {meal.mealType}
                          </Badge>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900">{meal.name}</h4>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl sm:text-2xl font-bold text-primary">{meal.calories}</p>
                          <p className="text-[10px] sm:text-xs text-gray-600">calories</p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{meal.description}</p>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="text-center p-1.5 sm:p-2 bg-blue-50 rounded">
                          <p className="text-[10px] sm:text-xs text-gray-600">Protein</p>
                          <p className="font-semibold text-xs sm:text-sm text-blue-900">{meal.protein}g</p>
                        </div>
                        <div className="text-center p-1.5 sm:p-2 bg-green-50 rounded">
                          <p className="text-[10px] sm:text-xs text-gray-600">Carbs</p>
                          <p className="font-semibold text-xs sm:text-sm text-green-900">{meal.carbs}g</p>
                        </div>
                        <div className="text-center p-1.5 sm:p-2 bg-orange-50 rounded">
                          <p className="text-[10px] sm:text-xs text-gray-600">Fats</p>
                          <p className="font-semibold text-xs sm:text-sm text-orange-900">{meal.fats}g</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="nutrition">
                  <ChartCard title="Weekly Calorie Intake" description="Last 7 days">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={nutritionData}>
                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" fontSize={10} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="calories" fill="#f97316" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Exercise Tracker */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span>Today's Exercise</span>
                </h3>
                <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Log Activity
                </Button>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-3 sm:p-4 ${
                      exercise.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          exercise.completed ? 'bg-green-600' : 'bg-gray-200'
                        }`}>
                          {exercise.completed ? (
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          ) : (
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{exercise.name}</h4>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {exercise.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {exercise.calories} cal
                            </span>
                          </div>
                        </div>
                      </div>
                      {!exercise.completed && (
                        <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm flex-shrink-0">Complete</Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Health Goals */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Health Goals
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-600">Daily Calories</span>
                    <span className="font-medium">{targetCalories} cal</span>
                  </div>
                  <Progress value={(todayCalories / targetCalories) * 100} className="h-1.5 sm:h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-600">Exercise (Weekly)</span>
                    <span className="font-medium">4/5 days</span>
                  </div>
                  <Progress value={80} className="h-1.5 sm:h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="text-gray-600">Weight Goal</span>
                    <span className="font-medium">-5 lbs</span>
                  </div>
                  <Progress value={40} className="h-1.5 sm:h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">💡 Today's Tips</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Drink 2 more glasses of water to reach your goal</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Great job maintaining your exercise streak!</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Try adding more vegetables to your dinner</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Recommended Recipes */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">🍽️ Recommended</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-xs sm:text-sm text-gray-900">Grilled Salmon Bowl</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-1">High protein, low carb</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-xs sm:text-sm text-gray-900">Quinoa Salad</p>
                  <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Heart-healthy option</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DietLifestyle;
