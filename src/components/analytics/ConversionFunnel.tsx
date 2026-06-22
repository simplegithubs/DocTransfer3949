import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FunnelStep } from '../../lib/analyticsService';

interface ConversionFunnelProps {
    data: FunnelStep[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
    // Add conversion rate to data
    const processedData = data.map((step, index) => {
        const prevCount = index > 0 ? data[index - 1].count : step.count;
        const conversionRate = prevCount > 0 ? (step.count / prevCount) * 100 : 0;
        const totalRate = data[0]?.count > 0 ? (step.count / data[0].count) * 100 : 0;

        return {
            ...step,
            conversionRate: Math.round(conversionRate),
            totalRate: Math.round(totalRate)
        };
    });

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
                No funnel data available
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Steps List */}
            <motion.div 
                className="flex flex-col gap-4 justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {processedData.map((step, index) => (
                    <motion.div key={step.step_name} variants={itemVariants} className="relative">
                        {index > 0 && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center bg-white rounded-full w-8 h-8 border border-gray-100 shadow-sm">
                                <ArrowDown size={16} className="text-gray-400" />
                            </div>
                        )}

                        <div 
                            className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                            style={{ borderLeftColor: COLORS[index % 4], borderLeftWidth: '4px' }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="flex justify-between items-center mb-1 relative z-10">
                                <span className="font-bold text-gray-900">{step.step_name}</span>
                                <span className="font-black text-xl text-indigo-900">{step.count}</span>
                            </div>
                            <div className="text-xs text-gray-500 relative z-10">
                                {step.description}
                            </div>

                            {index > 0 && (
                                <div className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    step.conversionRate > 50 
                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' 
                                        : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                                } relative z-10`}>
                                    {step.conversionRate}% Conv.
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Visual Chart */}
            <div className="h-[350px] lg:col-span-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={processedData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorFunnel" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="step_name" 
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
                            contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(8px)'
                            }}
                            itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                            formatter={(value: any, name: any) => [value, name === 'count' ? 'Users' : name]}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorFunnel)"
                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="text-center mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 backdrop-blur-sm">
                    <p className="text-sm text-gray-600 font-medium">
                        Overall Conversion Rate: <span className="text-indigo-600 font-bold ml-2 text-lg">{processedData[processedData.length - 1]?.totalRate}%</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConversionFunnel;
