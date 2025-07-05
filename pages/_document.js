import { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script';
 
export default function Document({Component, pageProps}) {
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const midtransSnapUrl = process.env.NODE_ENV === 'production'
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
    
  return (
    <Html lang="en">
       <Head>
        {/* Script yang sebelumnya di _app.js sekarang ada di sini */}
        <Script
        type="text/javascript"
        src={midtransSnapUrl}
        data-client-key={midtransClientKey}
        strategy="beforeInteractive"
      />
      <Component {...pageProps} />
        
        {/* Font links, dll */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
