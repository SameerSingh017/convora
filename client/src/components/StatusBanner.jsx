export default function StatusBanner({ message }) {
  if (!message) return null;

  return (
    <div className="px-3 py-1 bg-[#534AB7]/20 border border-[#534AB7]/30 rounded-full text-xs text-[#CECBF6] animate-pulse">
      {message}
    </div>
  );
}
