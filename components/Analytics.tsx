import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

const INITIAL_DATA = [
  { name: 'Mon', views: 400, clicks: 240 },
  { name: 'Tue', views: 300, clicks: 139 },
  { name: 'Wed', views: 200, clicks: 980 },
  { name: 'Thu', views: 278, clicks: 390 },
  { name: 'Fri', views: 189, clicks: 480 },
  { name: 'Sat', views: 239, clicks: 380 },
  { name: 'Sun', views: 349, clicks: 430 },
];

const Analytics: React.FC = () => {
  const [chartData, setChartData] = useState(INITIAL_DATA);

  useEffect(() => {
    // Simulate live data updates on the chart
    const interval = setInterval(() => {
      setChartData(currentData => {
        // Randomly modify the "Sun" (Today) value to simulate real-time increments
        const newData = [...currentData];
        const todayIndex = 6;
        newData[todayIndex] = {
          ...newData[todayIndex],
          views: newData[todayIndex].views + (Math.random() > 0.5 ? 1 : 0),
          clicks: newData[todayIndex].clicks + (Math.random() > 0.8 ? 1 : 0),
        };
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto">
      <div className="flex items-center space-x-3 mb-8">
         <h2 className="text-3xl font-bold text-white">Analytics</h2>
         <div className="px-2 py-1 bg-gray-800 rounded text-[10px] uppercase font-bold text-gray-400 flex items-center">
            <Activity size={12} className="mr-1" />
            Live Data
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Views Chart */}
        <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Weekly Views</h3>
            <span className="text-xs text-green-400 font-mono animate-pulse">● Live</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#333', opacity: 0.4}}
                />
                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clicks Chart */}
        <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Link Clicks</h3>
             <span className="text-xs text-green-400 font-mono animate-pulse">● Live</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#333', opacity: 0.4}}
                />
                <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Links Table */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-gray-200">Top Performing Links</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900/50 text-gray-400">
            <tr>
              <th className="px-6 py-3 font-medium">Link Label</th>
              <th className="px-6 py-3 font-medium">Total Clicks</th>
              <th className="px-6 py-3 font-medium">CTR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-gray-300">
            <tr>
              <td className="px-6 py-4">Website</td>
              <td className="px-6 py-4 font-mono">1,203</td>
              <td className="px-6 py-4">42%</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Instagram</td>
              <td className="px-6 py-4 font-mono">842</td>
              <td className="px-6 py-4">28%</td>
            </tr>
             <tr>
              <td className="px-6 py-4">Book Now</td>
              <td className="px-6 py-4 font-mono">320</td>
              <td className="px-6 py-4">15%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;