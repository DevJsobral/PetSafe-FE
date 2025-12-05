/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#0A0A0F",
        "brand-darker": "#050507",

        // versão com opacidade
        "brand-darker-70": "rgba(5, 5, 7, 0.7)",

        "brand-card": "#11111A",
        "neon-blue": "#4CC9FF",
        "neon-blue-light": "#8AE8FF",
        "neon-glow": "rgba(76, 201, 255, 0.5)",
        "neon-strong": "rgba(76, 201, 255, 0.9)",

        "brand-light": "#F7F8FC",
        "brand-light-card": "#FFFFFF",
      },

      boxShadow: {
        neon: "0 0 15px rgba(76, 201, 255, 0.6)",
        "neon-soft": "0 0 8px rgba(76, 201, 255, 0.3)",
        card: "0 4px 20px rgba(0,0,0,0.4)",
      },

      borderRadius: {
        card: "1.1rem",
      },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease",
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },

        slideUp: {
          "0%": { opacity: 0, transform: "translateY(15px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },

        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(76, 201, 255, 0.6)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(76, 201, 255, 1)",
          },
        },
      },
    },
  },
  plugins: [],
};
