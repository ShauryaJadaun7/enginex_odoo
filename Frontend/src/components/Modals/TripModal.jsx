import React from 'react';

export default function TripModal({
    showTripModal, setShowTripModal, executeTripDispatch,
    newTrip, setNewTrip, vehicles, drivers
}) {
    if (!showTripModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl max-w-lg w-full p-6 space-y-4">
                <h3 className="text-lg font-black tracking-tight">Formulate Active Route Dispatch</h3>
                <form onSubmit={executeTripDispatch} className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Source Origin Terminal *</label>
                            <input type="text" required placeholder="Mundra Port Hub" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newTrip.source} onChange={e => setNewTrip({ ...newTrip, source: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Destination Target Point *</label>
                            <input type="text" required placeholder="Ahmedabad Logistics Park" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newTrip.destination} onChange={e => setNewTrip({ ...newTrip, destination: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Allocate Available Vehicle Assortment *</label>
                            <select required className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium" value={newTrip.vehicleId} onChange={e => setNewTrip({ ...newTrip, vehicleId: e.target.value })}>
                                <option value="">Select Vehicle...</option>
                                {vehicles.filter(v => v.status === "Available").map(v => (
                                    <option key={v.id} value={v.id}>{v.nameModel} [{v.registrationNumber}] (Max: {v.maxLoadCapacity}kg)</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Assign Operator Pilot Command *</label>
                            <select required className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 font-medium" value={newTrip.driverId} onChange={e => setNewTrip({ ...newTrip, driverId: e.target.value })}>
                                <option value="">Select Driver...</option>
                                {drivers.filter(d => d.status === "Available" && new Date(d.licenseExpiryDate) >= new Date()).map(d => (
                                    <option key={d.id} value={d.id}>{d.name} (Safety Score: {d.safetyScore}/100)</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Cargo Mass (kg) *</label>
                            <input type="number" required placeholder="450" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newTrip.cargoWeight} onChange={e => setNewTrip({ ...newTrip, cargoWeight: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Target Leg (km) *</label>
                            <input type="number" required placeholder="320" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newTrip.plannedDistance} onChange={e => setNewTrip({ ...newTrip, plannedDistance: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Freight Revenue (₹) *</label>
                            <input type="number" required placeholder="1850" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newTrip.revenue} onChange={e => setNewTrip({ ...newTrip, revenue: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setShowTripModal(false)} className="px-4 py-2 border rounded-xl font-bold">Abort Route</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md">Authorize & Dispatch Now</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
