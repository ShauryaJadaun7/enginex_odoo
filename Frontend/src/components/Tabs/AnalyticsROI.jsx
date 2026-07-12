import React, { useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    AreaChart, Area, 
    ScatterChart, Scatter, ZAxis, 
    ComposedChart, Line, LineChart,
    PieChart, Pie, Cell, Legend,
    CartesianGrid
} from 'recharts';

export default function AnalyticsROI({ vehicles = [], financialsPerVehicle = {}, trips = [], drivers = [], maintenanceLogs = [], fuelLogs = [], expenses = [] }) {
    
    // Process all the data for the 6 charts
    const { kpis, heatmapData, roiScatterData, payloadData, pieData, maintDaysData, breakevenData, driverData } = useMemo(() => {
        let totalFuelLiters = 0;
        let totalMiles = 0;
        let totalAcquisition = 0;
        let totalCost = 0;
        let totalRevenue = 0;
        let onTripCount = 0;

        // 1. Heatmap Data (Mock 14-day history converging to today's actual)
        const activeToday = vehicles.filter(v => v.status === 'On Trip').length;
        const availToday = vehicles.filter(v => v.status === 'Available').length;
        const shopToday = vehicles.filter(v => v.status === 'In Shop').length;
        
        const heatmapData = [];
        for (let i = 13; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            if (i === 0) {
                heatmapData.push({ date: 'Today', OnTrip: activeToday, Available: availToday, InShop: shopToday });
            } else {
                // Random variation converging to current
                const noise = Math.floor(Math.random() * 3) - 1;
                heatmapData.push({
                    date: dateStr,
                    OnTrip: Math.max(0, activeToday + noise),
                    Available: Math.max(0, availToday - noise),
                    InShop: Math.max(0, shopToday + (Math.random() > 0.7 ? 1 : 0))
                });
            }
        }

        // 2. Individual Vehicle Investment ROI Matrix
        const roiScatterData = vehicles.map(v => {
            const fin = financialsPerVehicle[v.id] || { fuelCost: 0, maintenanceCost: 0, totalCost: 0, revenue: 0, miles: 0, fuelLiters: 0 };
            
            totalFuelLiters += fin.fuelLiters;
            totalMiles += fin.miles;
            totalAcquisition += v.acquisitionCost || 0;
            totalCost += fin.totalCost;
            totalRevenue += fin.revenue;

            const netProfit = fin.revenue - fin.totalCost;
            const roi = v.acquisitionCost > 0 ? (netProfit / v.acquisitionCost) * 100 : 0;
            
            return {
                name: v.registrationNumber,
                odometer: v.odometer,
                roi: parseFloat(roi.toFixed(1)),
                fill: roi > 0 ? '#10b981' : (roi > -5 ? '#f59e0b' : '#ef4444') // Green, Amber, Red
            };
        });

        // KPI calculations
        const efficiency = totalFuelLiters > 0 ? (totalMiles / totalFuelLiters).toFixed(1) : "0.0";
        const utilization = vehicles.length > 0 ? Math.round((activeToday / vehicles.length) * 100) : 0;
        const netProfitGlobal = totalRevenue - totalCost;
        const roiGlobal = totalAcquisition > 0 ? ((netProfitGlobal / totalAcquisition) * 100).toFixed(1) : "0.0";

        // 3. Fuel Efficiency vs Payload
        const payloadDataMap = {};
        trips.forEach(t => {
            if (!payloadDataMap[t.vehicleId]) payloadDataMap[t.vehicleId] = { trips: 0, totalWeight: 0 };
            payloadDataMap[t.vehicleId].trips++;
            payloadDataMap[t.vehicleId].totalWeight += t.cargoWeight;
        });

        const payloadData = vehicles.map(v => {
            const fin = financialsPerVehicle[v.id] || { miles: 0, fuelLiters: 0 };
            const pd = payloadDataMap[v.id] || { trips: 0, totalWeight: 0 };
            const avgWeight = pd.trips > 0 ? pd.totalWeight / pd.trips : 0;
            const eff = fin.fuelLiters > 0 ? fin.miles / fin.fuelLiters : 0;
            
            return {
                name: v.registrationNumber,
                weight: Math.round(avgWeight),
                efficiency: parseFloat(eff.toFixed(1))
            };
        }).filter(d => d.weight > 0);

        // 4. Maintenance Downtime
        const maintCostByType = {};
        maintenanceLogs.forEach(m => {
            const v = vehicles.find(veh => veh.id === m.vehicleId);
            if (v) {
                maintCostByType[v.type] = (maintCostByType[v.type] || 0) + m.cost;
            }
        });
        const pieColors = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
        const pieData = Object.keys(maintCostByType).map((key, idx) => ({
            name: key, value: maintCostByType[key], fill: pieColors[idx % pieColors.length]
        }));

        const maintDaysData = vehicles.filter(v => v.status === 'In Shop').map(v => ({
            name: v.registrationNumber, days: Math.floor(Math.random() * 5) + 1 // Mocking days in shop since no timestamp
        }));

        // 5. Cost-to-Revenue Break-Even
        // Mocking 6 months based on current totals, distributing them.
        const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const breakevenData = months.map((m, idx) => {
            const factor = (idx + 1) / 6;
            return {
                month: m,
                revenue: Math.round(totalRevenue * factor * (0.8 + Math.random()*0.4)),
                cost: Math.round(totalCost * factor * (0.8 + Math.random()*0.4))
            };
        });

        // 6. Driver Risk-Reward Bubble
        const driverRevenueMap = {};
        const driverTripCountMap = {};
        trips.forEach(t => {
            if (t.status === 'Completed') {
                driverRevenueMap[t.driverId] = (driverRevenueMap[t.driverId] || 0) + t.revenue;
                driverTripCountMap[t.driverId] = (driverTripCountMap[t.driverId] || 0) + 1;
            }
        });

        const driverData = drivers.map(d => ({
            name: d.name,
            safety: d.safetyScore,
            revenue: driverRevenueMap[d.id] || 0,
            trips: driverTripCountMap[d.id] || 0,
            fill: d.safetyScore < 40 ? '#ef4444' : (d.safetyScore > 80 ? '#10b981' : '#3b82f6')
        })).filter(d => d.revenue > 0);

        return { 
            kpis: { efficiency, utilization, totalCost, roi: roiGlobal },
            heatmapData, roiScatterData, payloadData, pieData, maintDaysData, breakevenData, driverData
        };
    }, [vehicles, financialsPerVehicle, trips, drivers, maintenanceLogs, fuelLogs]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-white text-xs z-50">
                    <p className="font-bold mb-1 text-slate-300">
                        {label || (payload[0] && payload[0].payload && payload[0].payload.name) || ''}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color || entry.payload.fill || '#fff' }}>
                            {entry.name}: {entry.name === 'ROI' || entry.dataKey === 'roi' ? `${entry.value}%` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-500/30 p-5 rounded-xl shadow-sm dark:shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Fuel Efficiency</p>
                    <p className="text-3xl font-mono font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{kpis.efficiency} <span className="text-lg text-slate-400 dark:text-slate-500">km/l</span></p>
                </div>
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 p-5 rounded-xl shadow-sm dark:shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Fleet Utilization</p>
                    <p className="text-3xl font-mono font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">{kpis.utilization}%</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/30 p-5 rounded-xl shadow-sm dark:shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Operational Cost</p>
                    <p className="text-3xl font-mono font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition"><span className="text-lg text-slate-400 dark:text-slate-500">₹</span>{kpis.totalCost.toLocaleString()}</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-rose-500/30 p-5 rounded-xl shadow-sm dark:shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                    <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Vehicle ROI</p>
                    <p className="text-3xl font-mono font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">{kpis.roi}%</p>
                </div>
            </div>
            <p className="text-xs text-slate-500 font-mono italic px-2">ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost</p>

            {/* Charts Area 1: Utilization & ROI */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Dynamic Fleet Utilization Heatmap */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">1. Fleet Utilization Timeline</h3>
                        <p className="text-xs text-slate-500 mt-1">Active vs idle vs maintenance over last 14 days.</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={heatmapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="OnTrip" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="Available" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="InShop" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6} />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Individual Vehicle Investment ROI Matrix */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">2. Vehicle ROI Matrix</h3>
                        <p className="text-xs text-slate-500 mt-1">ROI % vs Odometer reading per asset.</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis type="number" dataKey="odometer" name="Odometer" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <YAxis type="number" dataKey="roi" name="ROI" unit="%" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <Tooltip cursor={{strokeDasharray: '3 3'}} content={<CustomTooltip />} />
                                <Scatter name="Vehicles" data={roiScatterData}>
                                    {roiScatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Charts Area 2: Fuel/Payload & Break-Even */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 3. Fuel Efficiency vs. Payload Analytics */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">3. Efficiency vs Payload</h3>
                        <p className="text-xs text-slate-500 mt-1">Impact of cargo weight on fuel consumption.</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={payloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                <Bar yAxisId="left" dataKey="weight" name="Cargo (kg)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency (km/l)" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. Cost-to-Revenue Break-Even */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">5. Operational Break-Even</h3>
                        <p className="text-xs text-slate-500 mt-1">Gross revenue vs total operational costs.</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={breakevenData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => `₹${val/1000}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                                <Line type="monotone" dataKey="cost" name="Costs" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Area 3: Maintenance & Driver Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 4. Maintenance Downtime & Cost */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">4. Maintenance Concentration</h3>
                        <p className="text-xs text-slate-500 mt-1">Cost breakdown by vehicle type.</p>
                    </div>
                    <div className="h-64 flex">
                        <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 h-full flex flex-col justify-center space-y-3">
                            {pieData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }}></div>
                                        <span>{d.name}</span>
                                    </div>
                                    <span className="font-mono text-slate-500 dark:text-slate-400">₹{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 6. Driver Risk-Reward Performance Matrix */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm dark:shadow-lg">
                    <div className="mb-6">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">6. Driver Risk-Reward</h3>
                        <p className="text-xs text-slate-500 mt-1">Safety score vs total revenue generated.</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis type="number" dataKey="safety" name="Safety Score" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                                <YAxis type="number" dataKey="revenue" name="Revenue" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => `₹${val/1000}k`} />
                                <ZAxis type="number" dataKey="trips" range={[50, 400]} name="Trips" />
                                <Tooltip cursor={{strokeDasharray: '3 3'}} content={<CustomTooltip />} />
                                <Scatter name="Drivers" data={driverData} fillOpacity={0.7}>
                                    {driverData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
