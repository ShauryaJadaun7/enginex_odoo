import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';

export default function DriverDirectory({
    drivers, globalSearch, handleExportDataCSV, user, setShowDriverModal, handleRemoveDriver
}) {
    const [showAllDrivers, setShowAllDrivers] = useState(false);

    const filteredDrivers = (drivers || [])
        .filter(d => globalSearch === "" || 
            (d.name || "").toLowerCase().includes(globalSearch.toLowerCase()) || 
            (d.licenseNumber || "").toLowerCase().includes(globalSearch.toLowerCase())
        );

    const displayedDrivers = showAllDrivers ? filteredDrivers : filteredDrivers.slice(0, 5);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase">Operational Crew Roster</h3>
                <div className="flex space-x-2">
                    <button onClick={() => handleExportDataCSV('drivers')} className="px-3 py-1.5 text-xs font-bold border rounded-lg bg-white dark:bg-slate-800 flex items-center space-x-1">
                        <Download className="h-3.5 w-3.5" /> <span>Export CSV</span>
                    </button>
                    {user.role === "Safety Officer" && (
                        <button onClick={() => setShowDriverModal(true)} className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition">
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
                            {user.role === "Safety Officer" && <th className="p-4 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {displayedDrivers.length === 0 ? (
                            <tr><td colSpan={user.role === "Safety Officer" ? "7" : "6"} className="p-6 text-center text-slate-500">No operators match the current filters.</td></tr>
                        ) : (
                            displayedDrivers.map(d => {
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
                                            <span className={`inline-block w-24 px-2 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                                                d.status === "Available" ? "bg-emerald-500 text-slate-900" : 
                                                d.status === "On Trip" ? "bg-blue-400 text-slate-900" : 
                                                d.status === "Suspended" ? "bg-rose-400 text-slate-900" : 
                                                "bg-amber-500 text-slate-900"
                                            }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        {user.role === "Safety Officer" && (
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleRemoveDriver(d.id)} className="text-slate-400 hover:text-rose-500 transition-colors" title="Remove Operator">
                                                    <Trash2 className="h-4 w-4 mx-auto" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                {filteredDrivers.length > 5 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/20 text-center border-t border-slate-100 dark:border-slate-800">
                        <button 
                            onClick={() => setShowAllDrivers(!showAllDrivers)}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            {showAllDrivers ? "Show Less" : `Show More (${filteredDrivers.length - 5} more)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
