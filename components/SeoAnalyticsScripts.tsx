// components/SeoAnalyticsScripts.tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

// ✅ SEGURIDAD: Validar formato de IDs de analytics para prevenir XSS
function isValidGTMId(id: string): boolean {
  return /^GTM-[A-Z0-9]{1,10}$/.test(id);
}

function isValidGAId(id: string): boolean {
  return /^G-[A-Z0-9]{1,15}$/.test(id) || /^UA-\d{4,}-\d{1,4}$/.test(id);
}

function isValidPixelId(id: string): boolean {
  return /^\d{10,20}$/.test(id);
}

export default function SeoAnalyticsScripts() {
  const [config, setConfig] = useState<{
    googleAnalyticsId?: string;
    metaPixelId?: string;
    googleTagManagerId?: string;
  }>({});

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch('/api/config/seo-analytics');
        if (res.ok) {
          const data = await res.json();
          // ✅ SEGURIDAD: Solo aceptar IDs con formato válido
          setConfig({
            googleAnalyticsId: data.googleAnalyticsId && isValidGAId(data.googleAnalyticsId) ? data.googleAnalyticsId : undefined,
            metaPixelId: data.metaPixelId && isValidPixelId(data.metaPixelId) ? data.metaPixelId : undefined,
            googleTagManagerId: data.googleTagManagerId && isValidGTMId(data.googleTagManagerId) ? data.googleTagManagerId : undefined,
          });
        }
      } catch (error) {
        console.error('Error loading SEO config:', error);
      }
    }
    fetchConfig();
  }, []);

  return (
    <>
      {/* ✅ QUITADO: Google Search Console (ahora está en layout.tsx) */}

      {/* Google Tag Manager */}
      {config.googleTagManagerId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${config.googleTagManagerId}');
              `,
            }}
          />
          {/* GTM noscript */}
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${config.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Google Analytics 4 (solo si NO hay GTM) */}
      {config.googleAnalyticsId && !config.googleTagManagerId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel (solo si NO hay GTM) */}
      {config.metaPixelId && !config.googleTagManagerId && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${config.metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${config.metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}