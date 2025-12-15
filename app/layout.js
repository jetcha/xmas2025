import './globals.css';
import { GameProvider } from './context/GameContext';
import { LanguageProvider } from './context/LanguageContext';
import GlobalResetButton from './components/GlobalResetButton';

export const metadata = {
  title: '交換禮物 2025',
  description: 'Gift Exchange PWA',
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
        <LanguageProvider>
          <GameProvider>
            <GlobalResetButton />
            {children}
          </GameProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
