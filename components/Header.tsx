import Link from 'next/link';
import { Menu, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-blue-700 tracking-tighter uppercase">
            Tech<span className="text-slate-900">Refine</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-600 uppercase tracking-wide">
            <Link href="/category/saas" className="hover:text-blue-600 transition">SaaS</Link>
            <Link href="/category/finance" className="hover:text-blue-600 transition">Finance</Link>
            <Link href="/category/tech" className="hover:text-blue-600 transition">Tech</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
            <Search size={20} />
          </button>
          <button className="md:hidden p-2 text-slate-500">
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}
