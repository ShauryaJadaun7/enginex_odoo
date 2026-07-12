import React from 'react';
import { AlertCircle, X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function AlertModal({ alertData, onClose }) {
    if (!alertData) return null;

    const { message, type = 'error' } = alertData;

    // Define styles and icons based on alert type
    const styles = {
        error: {
            bg: 'bg-rose-50 dark:bg-rose-950/40',
            border: 'border-rose-200 dark:border-rose-800',
            text: 'text-rose-800 dark:text-rose-300',
            icon: <AlertCircle className="h-10 w-10 text-rose-500" />,
            buttonBg: 'bg-rose-600 hover:bg-rose-700',
            title: 'Action Failed'
        },
        warning: {
            bg: 'bg-amber-50 dark:bg-amber-950/40',
            border: 'border-amber-200 dark:border-amber-800',
            text: 'text-amber-800 dark:text-amber-300',
            icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
            buttonBg: 'bg-amber-600 hover:bg-amber-700',
            title: 'Warning'
        },
        success: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            border: 'border-emerald-200 dark:border-emerald-800',
            text: 'text-emerald-800 dark:text-emerald-300',
            icon: <CheckCircle2 className="h-10 w-10 text-emerald-500" />,
            buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
            title: 'Success'
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-950/40',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-800 dark:text-blue-300',
            icon: <Info className="h-10 w-10 text-blue-500" />,
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
            title: 'Information'
        }
    };

    const currentStyle = styles[type] || styles.error;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            {/* Modal Box */}
            <div className={`relative z-10 w-full max-w-sm rounded-2xl border ${currentStyle.border} ${currentStyle.bg} shadow-2xl shadow-slate-900/20 transform transition-all animate-fade-in-up`}>
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 transition-colors">
                    <X className="h-5 w-5" />
                </button>

                <div className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                            {currentStyle.icon}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className={`text-lg font-black ${currentStyle.text} tracking-tight`}>{currentStyle.title}</h3>
                        <p className={`mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed`}>
                            {message}
                        </p>
                    </div>

                    <button 
                        onClick={onClose}
                        className={`w-full mt-4 py-3 rounded-xl text-white font-bold transition-all shadow-md transform hover:-translate-y-0.5 active:translate-y-0 ${currentStyle.buttonBg}`}
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
}
