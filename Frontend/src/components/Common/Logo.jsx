import React from 'react';

export default function Logo({ className = "h-6 w-6", textClassName = "text-xl font-extrabold" }) {
    return (
        <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
                <svg 
                    viewBox="0 -960 960 960" 
                    fill="currentColor" 
                    className={`${className} text-blue-600 dark:text-blue-400`}
                >
                    <path d="M440-80v-166q-68-13-118-60.5T252-423l-143 83-40-70 143-83q-3-13-4-27t4-27L69-630l40-70 143 83q20-43 51-76.5T372-748l-83-143 70-40 83 143q14-3 27-4t27 4l83-143 70 40-83 143q40 22 71.5 55.5T708-647l143-83 40 70-143 83q3 13 4 27t-4 27l143 83-40 70-143-83q-20 43-51.5 76.5T588-306v166h-148Zm40-280q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z"/>
                </svg>
            </div>
            <span className={`${textClassName} tracking-tight text-slate-900 dark:text-white`}>
                transit<span className="text-blue-600 dark:text-blue-400">ops</span>
            </span>
        </div>
    );
}
