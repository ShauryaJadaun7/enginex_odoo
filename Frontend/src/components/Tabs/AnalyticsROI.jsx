import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsROI({ vehicles, financialsPerVehicle }) {
    
    // Compute aggregations
    const stats = useMemo(() => {
        let totalFuelLiters = 0;
        let totalMiles = 0;
        let totalAcquisition = 0;
        let totalCost = 0;
        let totalRevenue = 0;
        let onTripCount = 0;

        const vehicleChartData = [];

        vehicles.forEach(v => {
            const fin = financialsPerVehicle[v.id] || { fuelCost: 0, maintenanceCost: 0, totalCost: 0, revenue: 0, miles: 0, fuelLiters: 0 };
            
            totalFuelLiters += fin.fuelLiters;
            totalMiles += fin.miles;
            totalAcquisition += v.acquisitionCost || 0;
            totalCost += fin.totalCost;
            totalRevenue += fin.revenue;

            if (v.status === 'On Trip') onTripCount++;

            vehicleChartData.push({
                name: v.nameModel,
                cost: fin.totalCost,
                revenue: fin.revenue
            });
        });

        // Top Costliest Vehicles
        vehicleChartData.sort((a, b) => b.cost - a.cost);

        const efficiency = totalFuelLiters > 0 ? (totalMiles / totalFuelLiters).toFixed(1) : "0.0";
        const utilization = vehicles.length > 0 ? Math.round((onTripCount / vehicles.length) * 100) : 0;
        const netProfit = totalRevenue - totalCost;
        const roi = totalAcquisition > 0 ? ((netProfit / totalAcquisition) * 100).toFixed(1) : "0.0";

        // Mock monthly revenue data for the chart
        const monthlyRevenue = [
            { name: 'Jan', revenue: totalRevenue * 0.4 },
            { name: 'Feb', revenue: totalRevenue * 0.5 },
            { name: 'Mar', revenue: totalRevenue * 0.45 },
            { name: 'Apr', revenue: totalRevenue * 0.6 },
            { name: 'May', revenue: totalRevenue * 0.55 },
            { name: 'Jun', revenue: totalRevenue * 0.8 },
            { name: 'Jul', revenue: totalRevenue }
        ];

        return {
            efficiency, utilization, totalCost, roi, monthlyRevenue, topCostliest: vehicleChartData.slice(0, 5)
        };
    }, [vehicles, financialsPerVehicle]);

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Fuel Efficiency</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-blue-400 transition">{stats.efficiency} <span className="text-lg text-slate-500">km/l</span></p>
                </div>
                
                <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Utilization</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-emerald-400 transition">{stats.utilization}%</p>
                </div>

                <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Operational Cost</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-amber-400 transition"><span className="text-lg text-slate-500">$</span>{stats.totalCost.toLocaleString()}</p>
                </div>

                <div className="bg-slate-900 border border-rose-500/30 p-5 rounded-xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle ROI</p>
                    <p className="text-3xl font-mono font-bold text-white group-hover:text-rose-400 transition">{stats.roi}%</p>
                </div>
            </div>
            <p className="text-xs text-slate-500 font-mono italic px-2">ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost</p>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Monthly Revenue</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: '#1e293b'}}
                                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc'}}
                                    itemStyle={{color: '#60a5fa', fontWeight: 'bold'}}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Costliest Vehicles */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Top Costliest Vehicles</h3>
                    <div className="space-y-5 mt-4">
                        {stats.topCostliest.map((v, index) => {
                            const maxCost = stats.topCostliest[0]?.cost || 1;
                            const percentage = (v.cost / maxCost) * 100;
                            // Alternate colors for top 3
                            const barColor = index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-amber-500' : 'bg-blue-500';
                            
                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        <span>{v.name}</span>
                                        <span className="font-mono text-slate-400">${v.cost.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                        <div className={`${barColor} h-3 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
