import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
