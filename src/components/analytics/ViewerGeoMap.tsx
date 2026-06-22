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
import { Globe, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GeoStat } from '../../lib/analyticsService';

interface ViewerGeoMapProps {
    data: GeoStat[];
}

const ViewerGeoMap: React.FC<ViewerGeoMapProps> = ({ data }) => {
    // Aggregate by country for the main view
    const countryData = data.reduce((acc, curr) => {
        const existing = acc.find(item => item.country === curr.country_code);
        if (existing) {
            existing.count += curr.session_count;
        } else {
            acc.push({ country: curr.country_code || 'Unknown', count: curr.session_count });
        }
        return acc;
    }, [] as { country: string; count: number }[]);

    const sortedData = countryData.sort((a, b) => b.count - a.count).slice(0, 10); // Top 10

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                <Globe size={48} className="opacity-20 mb-4" />
                <p>No geographic data collected yet</p>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-md px-4 py-3 border border-gray-100 rounded-xl shadow-xl flex items-center gap-3">
                    <Globe size={18} className="text-violet-500" />
                    <div>
                        <p className="text-gray-900 font-bold mb-0.5">{payload[0].payload.country}</p>
                        <p className="text-violet-600 font-medium text-sm">
                            {payload[0].value} visits
                        </p>
                    </div>
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
            className="w-full flex flex-col h-full"
        >
            {/* Top Countries Bar Chart */}
            <div className="h-[250px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={sortedData}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="country"
                            type="category"
                            width={50}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fontWeight: 600, fill: '#4b5563' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                            content={<CustomTooltip />}
                        />
                        <Bar 
                            dataKey="count" 
                            radius={[0, 6, 6, 0]} 
                            barSize={24}
                            animationDuration={1500}
                        >
                            {sortedData.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={`rgba(139, 92, 246, ${1 - (index * 0.06)})`} 
                                    className="hover:opacity-80 transition-opacity cursor-pointer"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Cities List (Simulated "Real-time" feel) */}
            <div className="mt-6 pt-6 border-t border-gray-100 relative z-10">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                    Recent Locations
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    {data.slice(0, 6).map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-2.5 bg-gray-50/80 hover:bg-violet-50 rounded-xl border border-gray-100/50 transition-colors group cursor-default"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <MapPin size={14} className="text-gray-400 group-hover:text-violet-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-700 truncate">
                                    {stat.city && stat.city !== 'null' ? stat.city : 'Unknown City'}, {stat.country_code}
                                </span>
                            </div>
                            <span className="text-xs font-bold text-violet-600 bg-violet-100/50 px-2 py-1 rounded-md ml-2 flex-shrink-0">
                                {stat.session_count}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ViewerGeoMap;
