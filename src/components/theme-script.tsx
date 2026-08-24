const STORAGE_KEY = "freelancebase-theme";

// Prevent flash of wrong theme before hydration.
// A plain inline script runs during HTML parsing (earlier than any next/script strategy in App Router).
export function ThemeScript() {
  const code = `(function(){try{var s='${STORAGE_KEY}';var t=localStorage.getItem(s);var e=t&&t!=="system"?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(e);}catch(e){}})();`;
  return (
    <script
      id="theme-init-script"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
