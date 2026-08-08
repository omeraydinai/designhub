import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Lexend_Deca, Nunito } from 'next/font/google';
import { I18nProvider } from '../src/i18n';
import { AnalyticsProvider } from '../src/analytics/provider';
import '@excalidraw/excalidraw/index.css';
import '../src/index.css';
import '../src/styles/home/index.css';

// Design Hub: self-hosted (next/font, zero runtime request) Lexend Deca +
// Nunito for the entry-shell dark redesign's headings/pills only. The rest
// of the app stays on Albert Sans (tokens.css --sans/--serif, untouched) --
// these are exposed as separate --font-heading/--font-body-alt vars so
// nothing else silently re-themes.
const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-heading',
  display: 'swap',
});
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-body-alt',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Design Hub',
  icons: {
    icon: '/app-icon.png',
    apple: '/app-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#f7f7f7',
};

/**
 * Inline script that runs before React hydrates so the first paint already
 * carries the app's appearance — no flash of unstyled content.
 *
 * `data-theme` is pinned to `light` unconditionally, and deliberately OUTSIDE
 * the try/catch: Open Design ships light-only (product removed the theme
 * setting), and a stored `dark` / `system` from the old picker must never reach
 * the document. Every dark CSS rule is gated on the attribute being absent, so
 * a storage read that throws must still leave the attribute stamped.
 * Keep the accent variable mix ratios in sync with `accentVars()` in
 * `src/state/appearance.ts`; this script cannot import application modules.
 */
const themeInitScript = `(function(){document.documentElement.setAttribute('data-theme','light');try{var c=JSON.parse(localStorage.getItem('open-design:config')||'{}');var a=typeof c.accentColor==='string'&&/^#[0-9a-fA-F]{6}$/.test(c.accentColor.trim())?c.accentColor.trim().toLowerCase():'#353535';if(c.configMigrationVersion!==3&&(a==='#87ea5c'||a==='#c96442'))a='#353535';var s=document.documentElement.style;s.setProperty('--accent',a);s.setProperty('--accent-strong','color-mix(in srgb, '+a+' 82%, var(--text-strong))');s.setProperty('--accent-soft','color-mix(in srgb, '+a+' 12%, var(--bg-subtle))');s.setProperty('--accent-tint','color-mix(in srgb, '+a+' 6%, var(--bg-panel))');s.setProperty('--accent-hover','color-mix(in srgb, '+a+' 86%, var(--text-strong))');}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: intentional theme-init inline script to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning className={`${lexendDeca.variable} ${nunito.variable}`}>
        <I18nProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
