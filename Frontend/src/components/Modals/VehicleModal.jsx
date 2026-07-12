import React from 'react';

export default function VehicleModal({
    showVehicleModal, setShowVehicleModal, createVehicle,
    newVehicle, setNewVehicle
}) {
    if (!showVehicleModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border shadow-2xl rounded-2xl max-w-md w-full p-6 space-y-4">
                <h3 className="text-lg font-black tracking-tight">Register Fleet Asset</h3>
                <form onSubmit={createVehicle} className="space-y-4 text-sm">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Registration Plate Identifier *</label>
                        <input type="text" required placeholder="GJ-01-XX-9999" className="w-full p-2.5 border rounded-xl font-mono uppercase dark:bg-slate-800 dark:border-slate-700" value={newVehicle.registrationNumber} onChange={e => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Model Archetype *</label>
                            <input type="text" required placeholder="Volvo FMX" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newVehicle.nameModel} onChange={e => setNewVehicle({ ...newVehicle, nameModel: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Body Configuration Class</label>
                            <select className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newVehicle.type} onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}>
                                <option value="Semi-Truck">Semi-Truck</option>
                                <option value="Box Truck">Box Truck</option>
                                <option value="Van">Van</option>
                                <option value="Pickup">Pickup</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Max Payload Capacity (kg) *</label>
                            <input type="number" required placeholder="5000" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newVehicle.maxLoadCapacity} onChange={e => setNewVehicle({ ...newVehicle, maxLoadCapacity: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Acquisition Investment (₹) *</label>
                            <input type="number" required placeholder="45000" className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newVehicle.acquisitionCost} onChange={e => setNewVehicle({ ...newVehicle, acquisitionCost: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setShowVehicleModal(false)} className="px-4 py-2 border rounded-xl font-bold">Abort Protocol</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold">Write Registry</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
