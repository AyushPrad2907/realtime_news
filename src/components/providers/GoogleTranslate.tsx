"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import Script from "next/script";

export function GoogleTranslate() {
  const { language } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const rawMatch = document.cookie.match(/googtrans=([^;]+)/);
    const currentVal = rawMatch ? decodeURIComponent(rawMatch[1]) : null;
    const targetVal = language === "hi" ? "/en/hi" : "/en/en";

    if (currentVal === targetVal) return; // already correct, no reload needed

    const lastReload = sessionStorage.getItem("last_translate_reload");
    const now = Date.now();
    if (lastReload && now - parseInt(lastReload, 10) < 5000) {
      console.warn("Google Translate: Prevented infinite reload loop.");
      return;
    }

    // Clear any existing googtrans cookies
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;

    // Set new value
    document.cookie = `googtrans=${targetVal}; path=/`;
    document.cookie = `googtrans=${targetVal}; path=/; domain=${window.location.hostname}`;
    
    sessionStorage.setItem("last_translate_reload", String(Date.now()));
    window.location.reload();
  }, [language, mounted]);

  if (!mounted) return null;

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} suppressHydrationWarning></div>
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.googleTranslateElementInit = function() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,en',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
