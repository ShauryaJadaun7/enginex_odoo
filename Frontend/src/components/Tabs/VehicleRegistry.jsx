import React, { useState } from 'react';
import { Filter, Download, Plus } from 'lucide-react';

export default function VehicleRegistry({
    vehicles, vehicleFilterType, setVehicleFilterType,
    vehicleFilterStatus, setVehicleFilterStatus, globalSearch,
    handleExportDataCSV, user, setShowVehicleModal
}) {
    const [showAllVehicles, setShowAllVehicles] = useState(false);

    const filteredVehicles = (vehicles || [])
        .filter(v => vehicleFilterType === "" || v.type === vehicleFilterType)
        .filter(v => vehicleFilterStatus === "" || v.status === vehicleFilterStatus)
        .filter(v => globalSearch === "" || 
            (v.registrationNumber || "").toLowerCase().includes(globalSearch.toLowerCase()) || 
            (v.nameModel || "").toLowerCase().includes(globalSearch.toLowerCase())
        );

    const displayedVehicles = showAllVehicles ? filteredVehicles : filteredVehicles.slice(0, 5);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center space-x-3">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select className="px-3 py-1.5 border rounded-lg text-xs dark:bg-slate-800 dark:border-slate-700" value={vehicleFilterType} onChange={e => setVehicleFilterType(e.target.value)}>
                        <option value="">All Configurations</option>
                        <option value="Semi-Truck">Semi-Truck</option>
                        <option value="Box Truck">Box Truck</option>
                        <option value="Van">Van</option>
                        <option value="Pickup">Pickup</option>
                    </select>
                    <select className="px-3 py-1.5 border rounded-lg text-xs dark:bg-slate-800 dark:border-slate-700" value={vehicleFilterStatus} onChange={e => setVehicleFilterStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="On Trip">On Trip</option>
                        <option value="In Shop">In Shop</option>
                        <option value="Retired">Retired</option>
                    </select>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => handleExportDataCSV('vehicles')} className="px-3 py-1.5 text-xs font-bold border rounded-lg bg-white dark:bg-slate-800 flex items-center space-x-1">
                        <Download className="h-3.5 w-3.5" /> <span>Export CSV</span>
                    </button>
                    {user.role === "Fleet Manager" && (
                        <button onClick={() => setShowVehicleModal(true)} className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg flex items-center space-x-1">
                            <Plus className="h-3.5 w-3.5" /> <span>Register Asset</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                            <th className="p-4">Reg Number</th>
                            <th className="p-4">Vehicle Model / Fleet Name</th>
                            <th className="p-4">Body Configuration</th>
                            <th className="p-4 text-right">Max Capacity</th>
                            <th className="p-4 text-right">Odometer Metrics</th>
                            <th className="p-4 text-center">Operational Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {displayedVehicles.length === 0 ? (
                            <tr><td colSpan="6" className="p-6 text-center text-slate-500">No vehicles match the current filters.</td></tr>
                        ) : (
                            displayedVehicles.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                                    <td className="p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{v.registrationNumber}</td>
                                    <td className="p-4 font-semibold">{v.nameModel}</td>
                                    <td className="p-4"><span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{v.type}</span></td>
                                    <td className="p-4 text-right font-semibold">{v.maxLoadCapacity} kg</td>
                                    <td className="p-4 text-right text-slate-500 font-mono">{v.odometer.toLocaleString()} km</td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block w-24 px-2 py-1.5 rounded-lg text-xs font-bold shadow-sm ${
                                            v.status === "Available" ? "bg-emerald-500 text-slate-900" :
                                            v.status === "On Trip" ? "bg-blue-400 text-slate-900" :
                                            v.status === "In Shop" ? "bg-amber-600 text-slate-900" : 
                                            "bg-rose-400 text-slate-900"
                                        }`}>
                                            {v.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {filteredVehicles.length > 5 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/20 text-center border-t border-slate-100 dark:border-slate-800">
                        <button 
                            onClick={() => setShowAllVehicles(!showAllVehicles)}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            {showAllVehicles ? "Show Less" : `Show More (${filteredVehicles.length - 5} more)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
