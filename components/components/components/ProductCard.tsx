import Link from 'next/link';
import { Star, TrendingUp, ChevronRight } from 'lucide-react';

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Top Section: Tag and Sentiment */}
      <div className="flex justify-between items-start mb-6">
        <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100">
          {product.tag}
        </span>
        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
          <Star size={14} fill="currentColor" />
          <span className="text-sm font-black text-slate-700">{product.rating}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-6 flex-grow">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic">
          "{product.description}"
        </p>
      </div>

      {/* Public Data Proof Point */}
      <div className="flex items-center gap-2 mb-8 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <TrendingUp size={16} className="text-blue-600" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
          High Public Consensus on Reddit & X
        </span>
      </div>

      {/* Bottom Section: Price and Button */}
      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
        <div>
          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pricing From</span>
          <span className="text-lg font-black text-slate-900">{product.price}</span>
        </div>
        
        <Link 
          href={`/products/${product.slug}`}
          className="bg-blue-600 text-white p-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          Analysis <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
