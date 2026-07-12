import React from 'react';

export default function AnalyticsROI({ vehicles, financialsPerVehicle }) {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-slate-400 uppercase tracking-wide">Vehicle Strategic ROI Blueprint</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-bold border-b dark:border-slate-800">
                                <th className="p-4">Fleet Asset</th>
                                <th className="p-4 text-right">Fuel Efficiency</th>
                                <th className="p-4 text-right">Accumulated Cost</th>
                                <th className="p-4 text-right">Gross Revenue</th>
                                <th className="p-4 text-right">Net Operational Profit</th>
                                <th className="p-4 text-center">Asset ROI (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                            {vehicles.map(v => {
                                const fin = financialsPerVehicle[v.id] || { fuelCost: 0, maintenanceCost: 0, totalCost: 0, revenue: 0, miles: 0, fuelLiters: 0 };
                                const efficiency = fin.fuelLiters > 0 ? (fin.miles / fin.fuelLiters).toFixed(2) : "N/A";
                                const netProfit = fin.revenue - fin.totalCost;
                                const roi = v.acquisitionCost > 0 ? ((netProfit / v.acquisitionCost) * 100).toFixed(1) : "0.0";

                                return (
                                    <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 font-medium">
                                        <td className="p-4 font-bold">{v.nameModel} <span className="text-xs font-mono font-normal text-slate-400">({v.registrationNumber})</span></td>
                                        <td className="p-4 text-right font-mono text-blue-600">{efficiency} km/L</td>
                                        <td className="p-4 text-right font-mono text-rose-600">${fin.totalCost.toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono text-emerald-600">${fin.revenue.toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono font-bold">${netProfit.toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-black font-mono ${Number(roi) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{roi}%</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
