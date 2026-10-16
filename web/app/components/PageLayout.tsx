import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerVariant?: 'default' | 'transparent' | 'solid';
}

export default function PageLayout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  headerVariant = 'default',
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* O fundo global vem do GlobalBackground no layout.tsx */}
      
      {showHeader && <Header variant={headerVariant} />}
      
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
