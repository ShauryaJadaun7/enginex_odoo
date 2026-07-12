import React from 'react';

export default function CompletionModal({
    tripCompletionModal, setTripCompletionModal, submitTripCompletion,
    completionData, setCompletionData
}) {
    if (!tripCompletionModal.show) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border max-w-md w-full p-6 space-y-4 rounded-2xl">
                <h3 className="text-lg font-black">Document Route Manifest Completion</h3>
                <form onSubmit={submitTripCompletion} className="space-y-4 text-sm">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Final Verified Odometer Value (km) *</label>
                        <input type="number" required className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={completionData.finalOdometer} onChange={e => setCompletionData({ ...completionData, finalOdometer: Number(e.target.value) })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Fuel Consumed (Liters) *</label>
                            <input type="number" required className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={completionData.fuelConsumed} onChange={e => setCompletionData({ ...completionData, fuelConsumed: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Fuel Financial Cost ($) *</label>
                            <input type="number" required className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={completionData.fuelCost} onChange={e => setCompletionData({ ...completionData, fuelCost: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={() => setTripCompletionModal({ show: false, tripId: "" })} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">Conclude Manifest</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
