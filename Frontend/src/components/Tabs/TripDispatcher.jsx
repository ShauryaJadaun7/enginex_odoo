import React from 'react';
import { Download, Plus } from 'lucide-react';

export default function TripDispatcher({
    trips, vehicles, drivers, user, handleExportDataCSV,
    setShowTripModal, handleCancelTrip, openCompletionInterface
}) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase">Waybill Routing System</h3>
                <div className="flex space-x-2">
                    <button onClick={() => handleExportDataCSV('trips')} className="px-3 py-1.5 text-xs font-bold border rounded-lg bg-white dark:bg-slate-800 flex items-center space-x-1">
                        <Download className="h-3.5 w-3.5" /> <span>Export CSV</span>
                    </button>
                    {user.role !== "Safety Officer" && user.role !== "Financial Analyst" && (
                        <button onClick={() => setShowTripModal(true)} className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg flex items-center space-x-1">
                            <Plus className="h-3.5 w-3.5" /> <span>Initiate Dispatch Route</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map(t => {
                    const veh = vehicles.find(v => v.id === t.vehicleId);
                    const drv = drivers.find(d => d.id === t.driverId);
                    return (
                        <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${t.status === 'Dispatched' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>{t.status}</span>
                                    <h4 className="font-bold text-base mt-2">{t.source} &rarr; {t.destination}</h4>
                                </div>
                                <span className="text-sm font-mono font-bold text-emerald-600">${t.revenue}</span>
                            </div>
                            <div className="text-xs space-y-1.5 border-t border-b border-slate-100 dark:border-slate-800 py-3 text-slate-600 dark:text-slate-400">
                                <p>Asset Allocated: <strong>{veh?.nameModel}</strong> ({veh?.registrationNumber})</p>
                                <p>Assigned Captain: <strong>{drv?.name}</strong></p>
                                <p>Payload Mass: <strong>{t.cargoWeight} kg</strong> / Leg: <strong>{t.plannedDistance} km</strong></p>
                            </div>
                            <div className="flex justify-end space-x-2 text-xs font-bold">
                                {t.status === "Dispatched" && user.role !== "Safety Officer" && (
                                    <>
                                        <button onClick={() => handleCancelTrip(t.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-xl transition">Cancel Leg</button>
                                        <button onClick={() => openCompletionInterface(t.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl transition">Log Delivery</button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
