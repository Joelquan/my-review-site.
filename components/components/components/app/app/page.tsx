import products from '@/data/products.json';
import ProductCard from '@/components/ProductCard';
import { BarChart3, ShieldCheck, Users } from 'lucide-react';

export default function Home() {
  // We take the first 3 products from your JSON file
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      {/* 1. HERO SECTION: The "Value Proposition" */}
      <section className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100">
          <ShieldCheck size={14} /> 100% Public Data Analysis
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
          The Internet's <span className="text-blue-600 italic">True</span> Verdict.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We bypass the marketing hype. Our ratings are built on <strong>15,000+ public discussions</strong> across Reddit, X, and tech forums.
        </p>
      </section>

      {/* 2. PROOF POINTS: Why Trust Us? */}
      <section className="grid md:grid-cols-3 gap-8 mb-24 border-y border-slate-200 py-12">
        <div className="flex flex-col items-center text-center px-4">
          <BarChart3 className="text-blue-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest mb-2 font-black">Data Driven</h3>
          <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold tracking-tight italic">Analyzing public sentiment to remove expert bias.</p>
        </div>
        <div className="flex flex-col items-center text-center px-4">
          <Users className="text-blue-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest mb-2 font-black">Community Focus</h3>
          <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold tracking-tight italic">We listen to real users in the r/SaaS and r/FinTech subreddits.</p>
        </div>
        <div className="flex flex-col items-center text-center px-4">
          <ShieldCheck className="text-blue-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-900 uppercase text-sm tracking-widest mb-2 font-black">Unbiased Picks</h3>
          <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold tracking-tight italic">Zero pay-to-play. Rankings are earned via public domain data.</p>
        </div>
      </section>

      {/* 3. PRODUCT GRID: The Money Makers */}
      <section>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Top Recommendations</h2>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">March 2026 Consensus</p>
          </div>
          <a href="/category/saas" className="hidden sm:block text-blue-600 font-bold text-sm hover:underline uppercase tracking-widest">View All Tools →</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. NEWSLETTER: Capturing Leads */}
      <section className="mt-32 p-12 bg-slate-900 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Get The Data Reports</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto italic">Join 12,000+ founders receiving monthly public sentiment reports on the tools that actually work.</p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input type="email" placeholder="email@example.com" className="flex-1 p-4 rounded-2xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500 font-bold" />
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">Join</button>
          </div>
        </div>
      </section>
    </main>
  );
}
