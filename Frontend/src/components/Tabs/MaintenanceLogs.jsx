import React from 'react';
import { Plus } from 'lucide-react';

export default function MaintenanceLogs({
    maintenanceLogs, vehicles, user, setShowMaintenanceModal, closeMaintenanceRecord
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase">Workshop Asset Bay Logs</h3>
                {user.role === "Fleet Manager" && (
                    <button onClick={() => setShowMaintenanceModal(true)} className="px-3 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg flex items-center space-x-1">
                        <Plus className="h-3.5 w-3.5" /> <span>Issue Workshop Ticket</span>
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                            <th className="p-4">Fleet Unit</th>
                            <th className="p-4">Diagnostic Log Protocol</th>
                            <th className="p-4">Date Logged</th>
                            <th className="p-4 text-right">Invoice Cost</th>
                            <th className="p-4 text-center">Ticket Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {maintenanceLogs.map(m => {
                            const veh = vehicles.find(v => v.id === m.vehicleId);
                            return (
                                <tr key={m.id} className="hover:bg-slate-50/60 transition">
                                    <td className="p-4 font-bold">{veh?.nameModel} <span className="text-xs font-mono font-normal text-slate-400">({veh?.registrationNumber})</span></td>
                                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{m.description}</td>
                                    <td className="p-4 font-mono text-xs">{m.date}</td>
                                    <td className="p-4 text-right font-mono font-bold">₹{m.cost}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${m.status === 'Active' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{m.status === 'Active' ? 'In Shop' : 'Closed Out'}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {m.status === "Active" && user.role === "Fleet Manager" && (
                                            <button onClick={() => closeMaintenanceRecord(m.id)} className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Release Asset</button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
