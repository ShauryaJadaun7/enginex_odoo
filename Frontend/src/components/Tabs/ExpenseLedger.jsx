import React from 'react';
import { Plus } from 'lucide-react';

export default function ExpenseLedger({
    fuelLogs, expenses, vehicles, user, setShowExpenseModal
}) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase">Financial Outflow Ledgers</h3>
                {user.role !== "Safety Officer" && (
                    <button onClick={() => setShowExpenseModal(true)} className="px-3 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg flex items-center space-x-1">
                        <Plus className="h-3.5 w-3.5" /> <span>Log Outflow Record</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-wide">Fuel Acquisition Logs</h4>
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b">
                                <th className="p-3">Asset Unit</th>
                                <th className="p-3 text-right">Volume (Liters)</th>
                                <th className="p-3 text-right">Gross Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {fuelLogs.map(f => (
                                <tr key={f.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-bold">{vehicles.find(v => v.id === f.vehicleId)?.nameModel}</td>
                                    <td className="p-3 text-right font-mono">{f.liters} L</td>
                                    <td className="p-3 text-right font-mono font-bold text-emerald-600">${f.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="text-sm font-bold mb-4 text-slate-400 uppercase tracking-wide">Incidental Route Expenses</h4>
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 border-b">
                                <th className="p-3">Asset Unit</th>
                                <th className="p-3">Expense Category</th>
                                <th className="p-3 text-right">Gross Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {expenses.map(e => (
                                <tr key={e.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-bold">{vehicles.find(v => v.id === e.vehicleId)?.nameModel}</td>
                                    <td className="p-3 font-semibold text-slate-500">{e.type}</td>
                                    <td className="p-3 text-right font-mono font-bold text-emerald-600">${e.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
