import React from 'react';

export default function MaintenanceModal({
    showMaintenanceModal, setShowMaintenanceModal, executeMaintenanceLogging,
    newMaint, setNewMaint, vehicles
}) {
    if (!showMaintenanceModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border max-w-md w-full p-6 space-y-4 rounded-2xl">
                <h3 className="text-lg font-black">Route Unit to Maintenance Shop</h3>
                <form onSubmit={executeMaintenanceLogging} className="space-y-4 text-sm">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Select Active Target Asset *</label>
                        <select required className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newMaint.vehicleId} onChange={e => setNewMaint({ ...newMaint, vehicleId: e.target.value })}>
                            <option value="">Select Vehicle...</option>
                            {vehicles.filter(v => v.status !== "Retired").map(v => (
                                <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Diagnostic Maintenance Description *</label>
                        <textarea required placeholder="Hydraulic brake pad replacement..." className="w-full p-2.5 border rounded-xl h-20 dark:bg-slate-800 dark:border-slate-700" value={newMaint.description} onChange={e => setNewMaint({ ...newMaint, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Fix Cost (₹) *</label>
                            <input type="number" required placeholder="500" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newMaint.cost} onChange={e => setNewMaint({ ...newMaint, cost: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Date Logged</label>
                            <input type="date" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newMaint.date} onChange={e => setNewMaint({ ...newMaint, date: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setShowMaintenanceModal(false)} className="px-4 py-2 border rounded-xl font-bold">Abort</button>
                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-xl font-bold">Commit to Bay</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
