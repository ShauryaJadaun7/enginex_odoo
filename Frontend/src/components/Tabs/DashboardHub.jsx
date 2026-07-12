import React from 'react';
import { Plus, Wrench, DollarSign, CheckCircle2 } from 'lucide-react';

export default function DashboardHub({
    kpis, trips, vehicles, drivers, user,
    openCompletionInterface, setCurrentTab, setShowTripModal,
    setShowMaintenanceModal, setShowExpenseModal
}) {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                    { label: "Active Fleet", val: kpis.activeVehicles, c: "text-blue-600" },
                    { label: "Available", val: kpis.availableVehicles, c: "text-emerald-600" },
                    { label: "In Workshop", val: kpis.inShopVehicles, c: "text-amber-600" },
                    { label: "Active Trips", val: kpis.activeTrips, c: "text-indigo-600" },
                    { label: "Draft Trips", val: kpis.pendingTrips, c: "text-slate-500" },
                    { label: "Drivers Duty", val: kpis.driversOnDuty, c: "text-cyan-600" },
                    { label: "Utilization", val: `${kpis.utilization}%`, c: "text-slate-900 dark:text-white font-black" },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs font-bold text-slate-400 uppercase">{card.label}</p>
                        <p className={`text-2xl font-black mt-1 ${card.c}`}>{card.val}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <span>Active Dispatched Routes ({kpis.activeTrips})</span>
                    </h3>
                    <div className="space-y-3">
                        {trips.filter(t => t.status === "Dispatched").length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-6">No Dispatched Transit Network Routes Active.</p>
                        ) : (
                            trips.filter(t => t.status === "Dispatched").map(t => {
                                const veh = vehicles.find(v => v.id === t.vehicleId);
                                const drv = drivers.find(d => d.id === t.driverId);
                                return (
                                    <div key={t.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-sm">{t.source} &rarr; {t.destination}</p>
                                            <p className="text-xs text-slate-500 mt-1">Vehicle: <strong>{veh?.nameModel}</strong> | Captain: <strong>{drv?.name}</strong></p>
                                        </div>
                                        {user.role !== "Safety Officer" && (
                                            <button onClick={() => openCompletionInterface(t.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1">
                                                <CheckCircle2 className="h-3.5 w-3.5" /> <span>Deliver</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-3">Instant Operations Panel</h3>
                        <p className="text-xs text-slate-400 mb-4">Standard protocol actions.</p>
                        <div className="space-y-2">
                            <button onClick={() => { setCurrentTab("trips"); setShowTripModal(true); }} className="w-full py-2.5 px-4 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-between"><span>Dispatch Fleet Asset</span> <Plus className="h-4 w-4" /></button>
                            <button onClick={() => { setCurrentTab("maintenance"); setShowMaintenanceModal(true); }} className="w-full py-2.5 px-4 bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-between"><span>Issue Maintenance Ticket</span> <Wrench className="h-4 w-4" /></button>
                            <button onClick={() => { setCurrentTab("expenses"); setShowExpenseModal(true); }} className="w-full py-2.5 px-4 bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-between"><span>Log Fuel/Expense Receipt</span> <DollarSign className="h-4 w-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
