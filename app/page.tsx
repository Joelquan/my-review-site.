export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-10 text-center font-sans">
      <h1 className="text-6xl font-black text-blue-600 mb-4 tracking-tighter">TECHREFINE</h1>
      <p className="text-slate-500 text-xl font-medium">Your data-driven engine is now LIVE.</p>
      <div className="mt-10 px-8 py-3 bg-blue-50 text-blue-700 rounded-2xl font-bold uppercase tracking-widest border border-blue-100">
        Status: 100% Online
      </div>
    </div>
  );
}
