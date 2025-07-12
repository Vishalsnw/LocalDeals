import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'LocalDeal - Find Local Deals in Your City',
  description: 'Discover amazing deals from local businesses',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#667eea" />
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
```

```html
export const metadata: Metadata = {
  title: 'LocalDeal - Discover Amazing Local Deals',
  description: 'Find the best offers from local businesses in your city. Save money while supporting your community.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}
```

```html
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LocalDeal - Discover Amazing Local Deals',
  description: 'Find the best offers from local businesses in your city. Save money while supporting your community.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
```

```replit_final_file
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LocalDeal - Discover Amazing Local Deals',
  description: 'Find the best offers from local businesses in your city. Save money while supporting your community.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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