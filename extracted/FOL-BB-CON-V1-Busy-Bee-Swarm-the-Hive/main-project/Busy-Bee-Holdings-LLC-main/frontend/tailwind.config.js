/** @type {import('tailwindcss').Config} */
/* 
 * BUSY BEE DESIGN SYSTEM - Tailwind Configuration
 * Single Source of Truth for all styling
 */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* Colors - mapped to CSS variables */
      colors: {
        border: "hsl(var(--border))",
        "border-subtle": "hsl(var(--border-subtle))",
        input: "hsl(var(--input))",
        "input-bg": "hsl(var(--input-bg))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "foreground-muted": "hsl(var(--foreground-muted))",
        
        /* Primary - Amber/Honey */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        /* Secondary */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-hover))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        /* Destructive */
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          hover: "hsl(var(--destructive-hover))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        /* Muted */
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        /* Accent */
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        /* Popover */
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        /* Card */
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          subtle: "hsl(var(--card-subtle))",
        },
        
        /* Semantic colors */
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      
      /* Border radius */
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "var(--radius-sm)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      
      /* Shadows */
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      
      /* Typography */
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      
      /* Spacing for sidebar */
      spacing: {
        'sidebar': 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-collapsed)',
      },
      
      /* Animation */
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in": "slideIn 0.2s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
