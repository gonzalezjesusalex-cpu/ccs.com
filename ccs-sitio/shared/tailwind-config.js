// Config compartido de Tailwind para todo el sitio Cleaner Computer Shop.
// Se carga DESPUÉS del <script src="https://cdn.tailwindcss.com...">
// y ANTES de que el navegador termine de pintar la página.
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "inverse-primary": "#adc6ff",
        "surface-container": "#eceef0",
        "primary-fixed-dim": "#adc6ff",
        "surface-container-lowest": "#ffffff",
        "surface-bright": "#f7f9fb",
        "on-primary": "#ffffff",
        "background": "#f7f9fb",
        "surface": "#f7f9fb",
        "on-error-container": "#93000a",
        "surface-dim": "#d8dadc",
        "tertiary-fixed": "#d3e4fe",
        "error-container": "#ffdad6",
        "on-tertiary-container": "#fdfcff",
        "primary-fixed": "#d8e2ff",
        "outline-variant": "#c1c6d7",
        "secondary": "#5f5e5e",
        "inverse-surface": "#2d3133",
        "secondary-fixed-dim": "#c8c6c5",
        "inverse-on-surface": "#eff1f3",
        "on-secondary-container": "#656464",
        "on-tertiary": "#ffffff",
        "surface-tint": "#005bc1",
        "on-surface": "#191c1e",
        "on-error": "#ffffff",
        "secondary-fixed": "#e5e2e1",
        "on-tertiary-fixed": "#0b1c30",
        "on-tertiary-fixed-variant": "#38485d",
        "primary": "#0058bc",
        "outline": "#717786",
        "on-primary-container": "#fefcff",
        "on-secondary-fixed": "#1c1b1b",
        "on-background": "#191c1e",
        "secondary-container": "#e5e2e1",
        "tertiary": "#4d5d73",
        "surface-variant": "#e0e3e5",
        "primary-container": "#0070eb",
        "on-primary-fixed-variant": "#004493",
        "on-surface-variant": "#414755",
        "surface-container-highest": "#e0e3e5",
        "on-primary-fixed": "#001a41",
        "tertiary-fixed-dim": "#b7c8e1",
        "error": "#ba1a1a",
        "on-secondary-fixed-variant": "#474646",
        "on-secondary": "#ffffff",
        "surface-container-high": "#e6e8ea",
        "tertiary-container": "#66768d",
        "surface-container-low": "#f2f4f6"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "margin-desktop": "40px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "base": "4px",
        "container-max": "1280px"
      },
      fontFamily: {
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "display-lg": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "headline-md": ["Inter"],
        "headline-lg": ["Inter"],
        "label-md": ["Inter"],
        "code-sm": ["Inter"]
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "code-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }]
      }
    }
  }
};
