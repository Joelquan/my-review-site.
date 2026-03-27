import { ShieldCheck, BarChart3 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Social Data Statement */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-white text-2xl font-black mb-4 tracking-tighter uppercase">
            Tech<span className="text-blue-500">Refine</span>
          </h2>
          <div className="flex items-start gap-3 bg-slate-800 p-4 rounded-xl border border-slate-700">
            <BarChart3 className="text-blue-400 mt-1 shrink-0" size={20} />
            <p className="text-sm leading-relaxed">
              <strong>Our Methodology:</strong> We analyze public domain sentiment from Reddit, X, and tech forums. Our ratings represent the community consensus, not individual bias.
            </p>
          </div>
          <p className="mt-6 text-xs text-slate-500 italic flex items-center gap-2">
            <ShieldCheck size={14} /> Affiliate Disclosure: We may receive a commission for purchases made through our links at no additional cost to you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Categories</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/category/saas" className="hover:text-blue-400">SaaS Tools</a></li>
            <li><a href="/category/finance" className="hover:text-blue-400">Business Finance</a></li>
            <li><a href="/category/tech" className="hover:text-blue-400">Cloud & Tech</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Company</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/about" className="hover:text-blue-400">About Our Data</a></li>
            <li><a href="/privacy" className="hover:text-blue-400">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 mt-16 pt-8 text-center text-xs text-slate-600">
        © 2026 TechRefine Media. All ratings are based on public domain analysis.
      </div>
    </footer>
  );
}
