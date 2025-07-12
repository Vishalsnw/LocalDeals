
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'LocalDeal - Find Local Deals in Your City',
  description: 'Discover amazing deals from local businesses',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="mobile-app">
        <AuthProvider>
          <div className="app-container">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
