import React from 'react';
import { Loader2, Hexagon } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoadingScreen({ message = "Loading Data..." }) {
  return (
    <div className="min-h-[400px] w-full flex items-center justify-center p-8">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
           <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           >
             <Hexagon className="w-20 h-20 text-blue-100 fill-blue-50 stroke-[1.5]" />
           </motion.div>
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-widest mb-2 uppercase">{message}</h3>
        <div className="flex items-center space-x-1.5 mb-1">
           <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
           <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
           <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-300 tracking-widest mt-4 uppercase">Please Wait</p>
      </div>
    </div>
  );
}

export function FullScreenLoading({ message = "Initializing System" }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800 flex items-center justify-center z-50">
      <LoadingScreen message={message} />
    </div>
  );
}
