import React from 'react';
import { Search } from 'lucide-react';

export default function Topbar({ currentTab, globalSearch, setGlobalSearch }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-black capitalize tracking-tight">{currentTab} Operations Center</h1>
                <p className="text-sm text-slate-500">Logistics Control Console Engine.</p>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <Search className="h-4 w-4 text-slate-400 ml-1" />
                <input type="text" placeholder="Global Query Search..." className="bg-transparent text-sm focus:outline-none w-48 text-slate-900 dark:text-white" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />
            </div>
        </div>
    );
}
