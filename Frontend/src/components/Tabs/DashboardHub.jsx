import React, { useState } from 'react';
import { Plus, Wrench, DollarSign, CheckCircle2 } from 'lucide-react';

export default function DashboardHub({
    kpis, trips, vehicles, drivers, user, globalSearch,
    openCompletionInterface, setCurrentTab, setShowTripModal,
    setShowMaintenanceModal, setShowExpenseModal
}) {
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterRegion, setFilterRegion] = useState("All");
    const [showAllTrips, setShowAllTrips] = useState(false);

    // Vehicle Status calculations
    const totalVehicles = vehicles.length || 1; // Prevent div by 0
    const availableCount = vehicles.filter(v => v.status === "Available").length;
    const onTripCount = vehicles.filter(v => v.status === "On Trip").length;
    const inShopCount = vehicles.filter(v => v.status === "In Shop" || v.status === "Maintenance").length;
    const retiredCount = vehicles.filter(v => v.status === "Retired" || v.status === "Suspended").length;

    const CITY_REGIONS = {
        "Mundra Port": "West",
        "Ahmedabad ICD": "West",
        "Mumbai": "West",
        "Pune": "West",
        "Delhi": "North",
        "Jaipur": "North",
        "Chennai": "South",
        "Bangalore": "South",
        "Hyderabad": "South",
        "Vijayawada": "South",
        "Kolkata": "East",
        "Haldia": "East",
        "Surat": "West",
        "Vadodara": "West",
        "Mysore": "South",
        "Lucknow": "North",
        "Kanpur": "North",
        "Coimbatore": "South",
        "Kochi": "South",
        "Nashik": "West"
    };

    const getRegion = (city) => {
        if (!city) return "Other";
        return CITY_REGIONS[city] || "Other";
    };

    // Filter Trips based on dropdowns and globalSearch
    const filteredTrips = (trips || []).filter(t => {
        if (!t) return false;
        const veh = (vehicles || []).find(v => v && v.id === t.vehicleId);
        const drv = (drivers || []).find(d => d && d.id === t.driverId);
        
        let searchMatch = true;
        if (globalSearch && globalSearch.trim() !== "") {
            const query = globalSearch.toLowerCase();
            searchMatch = 
                (t.id && String(t.id).toLowerCase().includes(query)) ||
                (t.destination && String(t.destination).toLowerCase().includes(query)) ||
                (t.source && String(t.source).toLowerCase().includes(query)) ||
                (veh && (veh.nameModel || "").toLowerCase().includes(query)) ||
                (drv && (drv.name || "").toLowerCase().includes(query));
        }

        let typeMatch = filterType === "All" ? true : (veh && (veh.type || "").toLowerCase().includes(filterType.toLowerCase()));
        let statusMatch = filterStatus === "All" ? true : t.status === filterStatus;
        let regionMatch = filterRegion === "All" ? true : (getRegion(t.destination) === filterRegion || getRegion(t.source) === filterRegion);

        return searchMatch && typeMatch && statusMatch && regionMatch;
    });

    const displayedTrips = showAllTrips ? filteredTrips : filteredTrips.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Filters</span>
                <select 
                    className="bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
                    value={filterType} onChange={e => setFilterType(e.target.value)}
                >
                    <option value="All">Vehicle Type: All</option>
                    <option value="Truck">Trucks</option>
                    <option value="Van">Vans</option>
                    <option value="Pickup">Pickups</option>
                </select>
                <select 
                    className="bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
                    value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="All">Status: All</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                </select>
                <select 
                    className="bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-300"
                    value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
                >
                    <option value="All">Region: All</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                    { label: "Active Vehicles", val: kpis.activeVehicles, color: "blue-500" },
                    { label: "Available Vehicles", val: kpis.availableVehicles, color: "emerald-500" },
                    { label: "Vehicles in Maintenance", val: kpis.inShopVehicles, color: "amber-500" },
                    { label: "Active Trips", val: kpis.activeTrips, color: "blue-400" },
                    { label: "Drivers on Duty", val: kpis.driversOnDuty, color: "blue-600" },
                ].map((card, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 relative overflow-hidden group">
                        <div className={`absolute left-0 top-0 w-1 h-full bg-${card.color}`}></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                        <p className="text-3xl font-mono font-bold text-slate-800 dark:text-white">{String(card.val).padStart(2, '0')}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Active Routes Feed */}
                <div className="xl:col-span-2 space-y-4">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Trips</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider">
                                    <th className="p-4">Trip</th>
                                    <th className="p-4">Vehicle</th>
                                    <th className="p-4">Driver</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Destination</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {displayedTrips.length === 0 ? (
                                    <tr><td colSpan="5" className="p-6 text-center text-slate-500">No trips match the current filters.</td></tr>
                                ) : (
                                    displayedTrips.map(t => {
                                        const veh = vehicles.find(v => v.id === t.vehicleId);
                                        const drv = drivers.find(d => d.id === t.driverId);
                                        
                                        // Status badge coloring
                                        let statusColor = "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
                                        if (t.status === "On Trip" || t.status === "Dispatched") statusColor = "bg-blue-400 text-slate-900";
                                        if (t.status === "Completed") statusColor = "bg-emerald-500 text-slate-900";
                                        if (t.status === "Draft") statusColor = "bg-slate-500 text-white";

                                        return (
                                            <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                                                <td className="p-4 font-mono font-bold text-xs">{t.id.split('-')[0].toUpperCase()}</td>
                                                <td className="p-4 font-bold">{veh?.nameModel || 'N/A'}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-300">{drv?.name || 'N/A'}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded text-xs font-black tracking-wider ${statusColor}`}>{t.status}</span>
                                                </td>
                                                <td className="p-4 text-xs">{t.destination}</td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                        {filteredTrips.length > 5 && (
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/20 text-center border-t border-slate-100 dark:border-slate-800">
                                <button 
                                    onClick={() => setShowAllTrips(!showAllTrips)}
                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                >
                                    {showAllTrips ? "Show Less" : `Show More (${filteredTrips.length - 5} more)`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Vehicle Status Graphics */}
                    <div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Vehicle Status</h3>
                        <div className="space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            {[
                                { label: "Available", count: availableCount, color: "bg-emerald-500" },
                                { label: "On Trip", count: onTripCount, color: "bg-blue-400" },
                                { label: "In Shop", count: inShopCount, color: "bg-amber-600" },
                                { label: "Retired", count: retiredCount, color: "bg-rose-400" },
                            ].map((stat, idx) => {
                                const percentage = (stat.count / totalVehicles) * 100;
                                return (
                                    <div key={idx} className="flex items-center space-x-4">
                                        <span className="w-20 text-xs font-medium text-slate-600 dark:text-slate-300">{stat.label}</span>
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-4 flex overflow-hidden">
                                            <div className={`${stat.color} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Instant Operations Panel */}
                    <div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Operations Panel</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                            <p className="text-xs text-slate-400 mb-4">Standard protocol actions.</p>
                            <div className="space-y-3">
                                <button onClick={() => { setCurrentTab("trips"); setShowTripModal(true); }} className="w-full py-2.5 px-4 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-between shadow-lg shadow-blue-600/20"><span>Dispatch Fleet Asset</span> <Plus className="h-4 w-4" /></button>
                                <button onClick={() => { setCurrentTab("maintenance"); setShowMaintenanceModal(true); }} className="w-full py-2.5 px-4 bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-between shadow-lg shadow-amber-600/20"><span>Issue Maintenance Ticket</span> <Wrench className="h-4 w-4" /></button>
                                <button onClick={() => { setCurrentTab("expenses"); setShowExpenseModal(true); }} className="w-full py-2.5 px-4 bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-between shadow-lg shadow-emerald-700/20"><span>Log Fuel/Expense Receipt</span> <DollarSign className="h-4 w-4" /></button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
