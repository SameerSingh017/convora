import { useState } from 'react';

export default function TermsModal({ onAccept }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#16161e] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="w-8 h-8 bg-[#534AB7] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Before you start</h2>
            <p className="text-white/40 text-xs">Convora Community Guidelines</p>
          </div>
        </div>

        {/* Scrollable terms */}
        <div className="px-5 py-4 max-h-64 overflow-y-auto space-y-4 text-xs text-white/60 leading-relaxed">
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">1. Be Respectful</h3>
            <p>Treat every person you meet on Convora with basic human respect. Harassment, hate speech, threats, or abusive behaviour of any kind is strictly prohibited and may result in a permanent ban.</p>
          </section>
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">2. No Inappropriate Content</h3>
            <p>Do not share, display, or transmit nudity, sexually explicit content, or graphic violence. This platform is not intended for adult content. Violations are taken very seriously.</p>
          </section>
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">3. No Illegal Activity</h3>
            <p>Do not use Convora for any activity that violates local, national, or international laws. This includes sharing illegal content, solicitation, fraud, or any form of criminal activity.</p>
          </section>
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">4. Privacy & Safety</h3>
            <p>Do not share your personal information such as your full name, address, phone number, or financial details with strangers. Convora is not responsible for any personal information you voluntarily share.</p>
          </section>
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">5. Age Requirement</h3>
            <p>You must be at least 18 years old to use Convora. By proceeding, you confirm that you meet this age requirement. If you are under 18, please leave immediately.</p>
          </section>
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">6. Reporting</h3>
            <p>Use the report button if someone violates these guidelines. False reports submitted in bad faith may result in your own account being reviewed.</p>
          </section>
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">7. No Guarantee of Service</h3>
            <p>Convora is provided as-is. We do not guarantee uptime, match quality, or uninterrupted service. We reserve the right to terminate access for any user at any time without notice.</p>
          </section>
          <section>
            <h3 className="text-white/80 font-semibold mb-1 text-xs uppercase tracking-wide">8. Data & Anonymity</h3>
            <p>Convora does not require registration. However, your IP address and socket session may be logged for safety purposes. Chat content is not stored unless a report is filed.</p>
          </section>
        </div>

        {/* Checkbox + Accept */}
        <div className="px-5 py-4 border-t border-white/5 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  checked ? 'bg-[#534AB7] border-[#534AB7]' : 'bg-transparent border-white/20 group-hover:border-white/40'
                }`}
              >
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-white/50 leading-relaxed">
              I am 18 or older, I have read and agree to Convora's community guidelines and terms of use.
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!checked}
            className="w-full py-2.5 bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
          >
            Accept & Start Chatting
          </button>
        </div>
      </div>
    </div>
  );
}
