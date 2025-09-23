'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Users, Briefcase, Target } from 'lucide-react';

const nsqfAdoptionData = [
  { name: 'Level 1-2', learners: 4000 },
  { name: 'Level 3', learners: 3000 },
  { name: 'Level 4', learners: 2000 },
  { name: 'Level 5', learners: 2780 },
  { name: 'Level 6', learners: 1890 },
  { name: 'Level 7+', learners: 2390 },
];

const skillGapData = [
  { name: 'Communication', value: 400 },
  { name: 'React.js', value: 300 },
  { name: 'Node.js', value: 250 },
  { name: 'Project Mgmt', value: 200 },
  { name: 'Data Analysis', value: 150 },
];

const learnerGrowthData = [
    { name: 'Jan', learners: 1200 },
    { name: 'Feb', learners: 1500 },
    { name: 'Mar', learners: 2100 },
    { name: 'Apr', learners: 2400 },
    { name: 'May', learners: 3200 },
    { name: 'Jun', learners: 3800 },
];

const COLORS = ['#FF9933', '#3366FF', '#8884d8', '#82ca9d', '#ffc658'];

export function AnalyticsDashboard() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Career Aspiration</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Software Development</div>
            <p className="text-xs text-muted-foreground">Most popular choice</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skill Gap</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">English Communication</div>
            <p className="text-xs text-muted-foreground">Across 35% of profiles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card className="glass-card">
          <CardHeader>
            <CardTitle>Learner Growth</CardTitle>
            <CardDescription>Number of new learners per month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={learnerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip wrapperClassName='glass-card' />
                <Legend />
                <Line type="monotone" dataKey="learners" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>NSQF Level Adoption</CardTitle>
            <CardDescription>Distribution of learners across NSQF levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nsqfAdoptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip wrapperClassName='glass-card'/>
                <Legend />
                <Bar dataKey="learners" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Top 5 Skill Gaps in Cohort</CardTitle>
            <CardDescription>Most common skills learners need to acquire.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillGapData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {skillGapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperClassName='glass-card' />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
