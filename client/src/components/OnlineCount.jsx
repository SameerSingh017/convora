export default function OnlineCount({ count }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-xs text-green-400 font-medium">
        {count !== null ? count.toLocaleString() : '—'} online
      </span>
    </div>
  );
}
