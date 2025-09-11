export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        // Get theme from localStorage or default to dark
        const storedTheme = localStorage.getItem('theme');
        const theme = storedTheme || 'dark';
        
        // Apply theme immediately
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // Default to dark mode if localStorage is not available
        document.documentElement.classList.add('dark');
      }
    })();
  `

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  )
}