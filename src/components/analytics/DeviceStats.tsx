import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DeviceStat } from '../../lib/analyticsService';

interface DeviceStatsProps {
    data: DeviceStat[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const BROWSER_COLORS = ['#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

const DeviceStats: React.FC<DeviceStatsProps> = ({ data }) => {
    // Aggregate by device type
    const deviceData = data.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.device_type);
        if (existing) {
            existing.value += curr.session_count;
        } else {
            acc.push({ name: curr.device_type || 'unknown', value: curr.session_count });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    // Aggregate by browser
    const browserData = data.reduce((acc, curr) => {
        const browserName = curr.browser_name || 'Unknown';
        const existing = acc.find(item => item.name === browserName);
        if (existing) {
            existing.value += curr.session_count;
        } else {
            acc.push({ name: browserName, value: curr.session_count });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    const getDeviceIcon = (type: string, colorClass: string) => {
        switch (type.toLowerCase()) {
            case 'mobile': return <Smartphone size={16} className={colorClass} />;
            case 'tablet': return <Tablet size={16} className={colorClass} />;
            default: return <Monitor size={16} className={colorClass} />;
        }
    };

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
                No device data available
            </div>
        );
    }

    const totalSessions = data.reduce((a, b) => a + b.session_count, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md px-4 py-3 border border-gray-100 rounded-xl shadow-xl">
                    <p className="text-gray-900 font-bold capitalize mb-1">{payload[0].name}</p>
                    <p className="text-indigo-600 font-medium text-sm">
                        {payload[0].value} visits ({(payload[0].value / totalSessions * 100).toFixed(1)}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[350px]">
            {/* Device Type Chart */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center p-6 bg-gradient-to-b from-gray-50/50 to-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider relative z-10">Device Type</h4>
                <div className="w-full h-[220px] relative z-10">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={deviceData}
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {deviceData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Inner Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-gray-900">{totalSessions}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total</span>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex flex-wrap justify-center gap-4 mt-2 relative z-10">
                    {deviceData.map((d, i) => {
                        // Extracting color for explicit styling as Tailwind dynamic colors can be tricky
                        const colorHex = COLORS[i % COLORS.length];
                        return (
                            <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm hover:shadow transition-shadow">
                                <div style={{ color: colorHex }}>
                                    {getDeviceIcon(d.name, '')}
                                </div>
                                <span className="capitalize">{d.name}: {Math.round((d.value / totalSessions) * 100)}%</span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Browser Chart */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center p-6 bg-gradient-to-b from-gray-50/50 to-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h4 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wider relative z-10">Browser</h4>
                <div className="w-full h-[250px] relative z-10">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={browserData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                innerRadius={40}
                                fill="#8884d8"
                                dataKey="value"
                                stroke="white"
                                strokeWidth={3}
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                labelLine={false}
                                className="text-[10px] font-bold fill-white drop-shadow-md"
                            >
                                {browserData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={BROWSER_COLORS[index % BROWSER_COLORS.length]} className="hover:opacity-90 transition-opacity outline-none" />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default DeviceStats;
