import './globals.css';

export const metadata = {
  title: 'TechRefine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
