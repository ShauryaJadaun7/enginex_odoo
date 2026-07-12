import React from 'react';
import { Download, Plus } from 'lucide-react';

export default function DriverDirectory({
    drivers, globalSearch, handleExportDataCSV, user, setShowDriverModal
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase">Operational Crew Roster</h3>
                <div className="flex space-x-2">
                    <button onClick={() => handleExportDataCSV('drivers')} className="px-3 py-1.5 text-xs font-bold border rounded-lg bg-white dark:bg-slate-800 flex items-center space-x-1">
                        <Download className="h-3.5 w-3.5" /> <span>Export CSV</span>
                    </button>
                    {["Fleet Manager", "Safety Officer"].includes(user.role) && (
                        <button onClick={() => setShowDriverModal(true)} className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg flex items-center space-x-1">
                            <Plus className="h-3.5 w-3.5" /> <span>Onboard Operator</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                            <th className="p-4">Operator Name</th>
                            <th className="p-4">License Code</th>
                            <th className="p-4">Classification</th>
                            <th className="p-4">License Expiration</th>
                            <th className="p-4 text-center">Safety Rating</th>
                            <th className="p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {drivers
                            .filter(d => globalSearch === "" || d.name.toLowerCase().includes(globalSearch.toLowerCase()) || d.licenseNumber.toLowerCase().includes(globalSearch.toLowerCase()))
                            .map(d => {
                                const isExpired = new Date(d.licenseExpiryDate) < new Date();
                                return (
                                    <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                                        <td className="p-4 font-bold">{d.name}</td>
                                        <td className="p-4 font-mono text-xs">{d.licenseNumber}</td>
                                        <td className="p-4 text-xs font-semibold text-slate-500">{d.licenseCategory}</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-mono px-2 py-0.5 rounded ${isExpired ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50" : "text-slate-600"}`}>
                                                {d.licenseExpiryDate} {isExpired && "[EXPIRED]"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${d.safetyScore >= 90 ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'}`}>{d.safetyScore} / 100</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${d.status === "Available" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>{d.status}</span>
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
