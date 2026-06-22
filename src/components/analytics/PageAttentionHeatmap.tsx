import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import type { PageAttention } from '../../lib/analyticsService';

interface PageAttentionHeatmapProps {
    data: PageAttention[];
}

const PageAttentionHeatmap: React.FC<PageAttentionHeatmapProps> = ({ data }) => {
    // Sort by page number to be safe
    const sortedData = [...data].sort((a, b) => a.page_number - b.page_number);

    // Function to determine color based on duration
    const getColor = (duration: number, max: number) => {
        const intensity = Math.min(duration / max, 1);
        // From blue (low) to orange (medium) to rose (high)
        if (intensity > 0.7) return '#f43f5e'; // rose-500
        if (intensity > 0.4) return '#f59e0b'; // amber-500
        return '#3b82f6'; // blue-500
    };

    const maxDuration = Math.max(...data.map(d => d.avg_duration_seconds), 1);

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
                No page view data available
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-md px-4 py-3 border border-gray-100 rounded-xl shadow-xl">
                    <p className="text-gray-900 font-bold mb-1">Page {label}</p>
                    <p className="text-gray-600 text-sm">
                        Avg Time: <span className="font-bold text-gray-900">{Number(item.avg_duration_seconds).toFixed(1)}s</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Total Views: {item.total_views}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={sortedData}
                        margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="page_number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                            content={<CustomTooltip />}
                        />
                        <Bar 
                            dataKey="avg_duration_seconds" 
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                        >
                            {sortedData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={getColor(entry.avg_duration_seconds, maxDuration)} 
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                    <span className="text-sm text-gray-600 font-medium">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                    <span className="text-sm text-gray-600 font-medium">High Interest</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                    <span className="text-sm text-gray-600 font-medium">Hot Spot</span>
                </div>
            </div>
        </motion.div>
    );
};

export default PageAttentionHeatmap;
