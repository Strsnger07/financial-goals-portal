"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrency } from "@/contexts/currency-context"

interface Goal {
  id: string
  name: string
  targetAmount: number
  contributed: number
  category: string
  createdAt: any
}

interface GoalChartsProps {
  goals: Goal[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function GoalCharts({ goals }: GoalChartsProps) {
  const { formatCurrency } = useCurrency()
  // Pie chart data - distribution of funds across goals
  const pieData = goals
    .map((goal, index) => ({
      name: goal.name,
      value: goal.contributed,
      color: COLORS[index % COLORS.length],
    }))
    .filter((item) => item.value > 0)

  // Line chart data - contribution activity over time
  const lineData = goals.map((goal) => ({
    name: goal.name,
    contributed: goal.contributed,
    target: goal.targetAmount,
    progress: (goal.contributed / goal.targetAmount) * 100,
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Fund Distribution</CardTitle>
          <CardDescription className="text-gray-400">How your contributions are distributed across goals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${formatCurrency(Number(value))}`, "Contributed"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Goal Progress Overview</CardTitle>
          <CardDescription className="text-gray-400">Progress percentage for each of your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
              <Legend />
              <Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={2} name="Progress %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
