import React from 'react';
import { Plus } from 'lucide-react';

export default function ExpenseLedger({
    fuelLogs, expenses, vehicles, user, setShowExpenseModal
}) {
    // Calculate totals
    const totalFuelCost = fuelLogs.reduce((sum, f) => sum + (f.cost || 0), 0);
    const totalOtherCost = expenses.reduce((sum, e) => sum + (e.cost || 0), 0);
    const grandTotal = totalFuelCost + totalOtherCost;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase">Financial Outflow Ledgers</h3>
                {user.role !== "Safety Officer" && (
                    <div className="flex space-x-3">
                        <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center space-x-1 transition shadow-lg shadow-amber-600/20">
                            <Plus className="h-4 w-4" /> <span>Log Fuel</span>
                        </button>
                        <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center space-x-1 transition shadow-lg shadow-amber-600/20">
                            <Plus className="h-4 w-4" /> <span>Add Expense</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Fuel Logs</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Liters</th>
                                <th className="p-4 text-right">Fuel Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {fuelLogs.map(f => (
                                <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td className="p-4 font-bold">{vehicles.find(v => v.id === f.vehicleId)?.nameModel || 'Unknown'}</td>
                                    <td className="p-4 text-slate-500 font-mono text-xs">{f.date || 'N/A'}</td>
                                    <td className="p-4 text-right font-mono text-slate-600 dark:text-slate-300">{f.liters} L</td>
                                    <td className="p-4 text-right font-mono font-bold text-rose-500">${f.cost?.toLocaleString() || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Other Expenses (Toll / Misc)</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider">
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {expenses.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                    <td className="p-4 font-bold">{vehicles.find(v => v.id === e.vehicleId)?.nameModel || 'Unknown'}</td>
                                    <td className="p-4 text-slate-500 font-mono text-xs">{e.date || 'N/A'}</td>
                                    <td className="p-4 font-semibold text-slate-500">{e.expenseType || e.type || 'N/A'}</td>
                                    <td className="p-4 text-right font-mono font-bold text-rose-500">${e.cost?.toLocaleString() || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Summary Footer */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-xs">Total Operational Cost (Auto) = Fuel + Expenses</span>
                    <span className="font-black text-amber-500 text-lg font-mono">${grandTotal.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
