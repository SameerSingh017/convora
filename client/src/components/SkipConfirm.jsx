import { useState } from 'react';

export default function SkipConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-6 sm:pb-0 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#16161e] border border-white/10 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-[#534AB7]/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-sm">Skip this stranger?</h3>
          <p className="text-white/40 text-xs mt-1 leading-relaxed">
            You'll be placed back in the queue to find someone new.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-white/10 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors"
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#534AB7] text-white rounded-xl text-sm font-medium hover:bg-[#3C3489] transition-colors"
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}
