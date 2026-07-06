'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

interface ReportChartsProps {
  activeInvestments: number
  completedInvestments: number
  pendingInvestments: number
  approvedKYC: number
  pendingKYC: number
  monthlyData: [string, { invested: number; count: number }][]
}

const COLORS = {
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#eab308',
  red: '#ef4444',
  teal: '#14b8a6',
}

export function ReportCharts({
  activeInvestments,
  completedInvestments,
  pendingInvestments,
  approvedKYC,
  pendingKYC,
  monthlyData,
}: ReportChartsProps) {
  const investmentStatusData = [
    { name: 'Active', value: activeInvestments, color: COLORS.green },
    { name: 'Completed', value: completedInvestments, color: COLORS.blue },
    { name: 'Pending', value: pendingInvestments, color: COLORS.yellow },
  ]

  const kycStatusData = [
    { name: 'Approved', value: approvedKYC, color: COLORS.green },
    { name: 'Pending', value: pendingKYC, color: COLORS.yellow },
  ]

  const monthlyChartData = monthlyData.map(([month, data]) => ({
    month,
    invested: data.invested,
    count: data.count,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Investment Status Pie Chart */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4">Investment Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={investmentStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {investmentStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4">
          {investmentStatusData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-300">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Status Pie Chart */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-4">KYC Verification Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={kycStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {kycStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-4">
          {kycStatusData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-slate-300">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Investment Trend Line Chart */}
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="font-semibold text-white mb-4">Monthly Investment Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="invested" stroke={COLORS.green} strokeWidth={2} name="Invested Amount" />
            <Line type="monotone" dataKey="count" stroke={COLORS.blue} strokeWidth={2} name="Investment Count" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
