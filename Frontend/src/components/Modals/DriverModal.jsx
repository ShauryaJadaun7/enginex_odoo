import React from 'react';

export default function DriverModal({
    showDriverModal, setShowDriverModal, createDriver,
    newDriver, setNewDriver
}) {
    if (!showDriverModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border shadow-2xl rounded-2xl max-w-md w-full p-6 space-y-4">
                <h3 className="text-lg font-black tracking-tight">Onboard Operational Operator</h3>
                <form onSubmit={createDriver} className="space-y-4 text-sm">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Full Corporate Legal Name *</label>
                        <input type="text" required placeholder="Alex Mercer" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newDriver.name} onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">License Code ID *</label>
                            <input type="text" required placeholder="LIC-9988-IN" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newDriver.licenseNumber} onChange={e => setNewDriver({ ...newDriver, licenseNumber: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">License Classification</label>
                            <select className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newDriver.licenseCategory} onChange={e => setNewDriver({ ...newDriver, licenseCategory: e.target.value })}>
                                <option value="Heavy Commercial">Heavy Commercial</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Light Vehicle">Light Vehicle</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">License Expiration Date *</label>
                            <input type="date" required className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newDriver.licenseExpiryDate} onChange={e => setNewDriver({ ...newDriver, licenseExpiryDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Safety Rating Score (0-100)</label>
                            <input type="number" min="0" max="100" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newDriver.safetyScore} onChange={e => setNewDriver({ ...newDriver, safetyScore: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setShowDriverModal(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Write Crew Log</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
