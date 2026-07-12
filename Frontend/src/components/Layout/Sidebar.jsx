import React from 'react';
import { Truck, Sun, Moon, LayoutDashboard, Users, MapPin, Wrench, DollarSign, BarChart3, LogOut } from 'lucide-react';

export default function Sidebar({ darkMode, setDarkMode, user, setUser, currentTab, setCurrentTab }) {
    return (
        <aside className={`w-64 border-r flex flex-col justify-between sticky top-0 h-screen ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div>
                <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Truck className="h-5 w-5" /></div>
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">TransitOps</span>
                    </div>
                    <button onClick={() => setDarkMode(!darkMode)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                </div>

                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-slate-800/20">
                    <p className="text-xs font-bold text-slate-400 uppercase">Active Workspace</p>
                    <p className="text-sm font-bold truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold bg-blue-600 text-white rounded-md uppercase tracking-wider">{user.role}</span>
                </div>

                <nav className="p-4 space-y-1">
                    {[
                        { id: "dashboard", label: "Dashboard Hub", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["Fleet Manager", "Safety Officer", "Dispatcher", "Financial Analyst"] },
                        { id: "vehicles", label: "Vehicle Registry", icon: <Truck className="h-4 w-4" />, roles: ["Fleet Manager"] },
                        { id: "drivers", label: "Driver Directory", icon: <Users className="h-4 w-4" />, roles: ["Safety Officer", "Dispatcher"] },
                        { id: "trips", label: "Trip Dispatcher", icon: <MapPin className="h-4 w-4" />, roles: ["Dispatcher"] },
                        { id: "maintenance", label: "Maintenance Logs", icon: <Wrench className="h-4 w-4" />, roles: ["Fleet Manager", "Safety Officer"] },
                        { id: "expenses", label: "Fuel & Expenses", icon: <DollarSign className="h-4 w-4" />, roles: ["Financial Analyst"] },
                        { id: "analytics", label: "Reports & ROI", icon: <BarChart3 className="h-4 w-4" />, roles: ["Financial Analyst"] },
                    ].filter(item => item.roles.includes(user.role)).map(item => (
                        <button key={item.id} onClick={() => setCurrentTab(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${currentTab === item.id ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                            {item.icon} <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setUser(null)} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 rounded-xl text-sm font-bold"><LogOut className="h-4 w-4" /> <span>Session Exit</span></button>
            </div>
        </aside>
    );
}
