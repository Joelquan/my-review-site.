import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'TechRefine | Data-Backed Tech & Finance Reviews',
  description: 'Unbiased analysis of the best tools based on public domain sentiment and community consensus.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen flex flex-col">
        {/* Top of the sandwich */}
        <Header />
        
        {/* The filling (the content of each page) */}
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Bottom of the sandwich */}
        <Footer />
      </body>
    </html>
  );
}
