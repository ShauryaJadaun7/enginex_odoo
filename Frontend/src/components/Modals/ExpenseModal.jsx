import React from 'react';

export default function ExpenseModal({
    showExpenseModal, setShowExpenseModal, createStandaloneExpense,
    newExp, setNewExp, vehicles
}) {
    if (!showExpenseModal) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border max-w-md w-full p-6 space-y-4 rounded-2xl">
                <h3 className="text-lg font-black">Document Financial Operational Outflow</h3>
                <form onSubmit={createStandaloneExpense} className="space-y-4 text-sm">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Target Fleet Asset *</label>
                        <select required className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newExp.vehicleId} onChange={e => setNewExp({ ...newExp, vehicleId: e.target.value })}>
                            <option value="">Select target vehicle...</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>{v.nameModel} ({v.registrationNumber})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <label className="text-xs font-bold text-slate-500 uppercase">Is this a Fuel Purchase Log?</label>
                        <input type="checkbox" checked={newExp.isFuel} className="h-4 w-4 text-blue-600 rounded" onChange={e => setNewExp({ ...newExp, isFuel: e.target.checked })} />
                    </div>

                    {!newExp.isFuel ? (
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Expense Typology Category</label>
                            <select className="w-full p-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700" value={newExp.type} onChange={e => setNewExp({ ...newExp, type: e.target.value })}>
                                <option value="Toll">Toll Fee</option>
                                <option value="Insurance">Asset Insurance Premium</option>
                                <option value="Permit">Cross-State Transit Permit</option>
                                <option value="Other">Other Incidental Outflow</option>
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Fuel Intake Volume (Liters) *</label>
                            <input type="number" required placeholder="80" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newExp.liters} onChange={e => setNewExp({ ...newExp, liters: e.target.value })} />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Gross Cost (₹) *</label>
                            <input type="number" required placeholder="120" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Transaction Date</label>
                            <input type="date" className="w-full p-2.5 border rounded-xl font-mono dark:bg-slate-800 dark:border-slate-700" value={newExp.date} onChange={e => setNewExp({ ...newExp, date: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setShowExpenseModal(false)} className="px-4 py-2 border rounded-xl font-bold">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold">Post Ledger</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
