import products from '@/data/products.json';
import { ShieldCheck, Star, TrendingUp, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-16 bg-slate-50 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
          <ShieldCheck size={14} /> 100% Public Data Analysis
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
          The Internet's <span className="text-blue-600 italic">True</span> Verdict.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed italic">
          "We bypass marketing hype using public domain sentiment."
        </p>
      </section>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {product.tag}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={14} fill="currentColor" /> {product.rating}
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-2">{product.name}</h3>
            <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">"{product.description}"</p>
            
            <div className="flex items-center gap-2 mb-8 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <TrendingUp size={16} className="text-blue-600" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Public Consensus</span>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <span className="text-lg font-black text-slate-900">{product.price}</span>
              <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition">
                Analysis <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
