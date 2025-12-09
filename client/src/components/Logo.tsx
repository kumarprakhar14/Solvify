// components/SolvifyLogo.jsx
import React from "react";

const SolvifyLogo = ({ className = "", title = "Solvify logo", ...props }) => {
  const style = `
    /* Default (Light Mode) */
    .solvify-brand-text { 
        font-family: 'Poppins', 'Montserrat', sans-serif; 
        font-weight: 800; 
        fill: var(--solvify-brand); /* Dark text */
        transition: fill 0.3s ease;
    }
    .solvify-tagline-text { 
        font-family: 'Poppins', 'Montserrat', sans-serif; 
        font-weight: 500; 
        fill: var(--solvify-tagline); /* Gray text */
        letter-spacing: 0.5px; 
        transition: fill 0.3s ease;
    }

    // /* Dark Mode Override */
    // @media (prefers-color-scheme: dark) {
    //   .solvify-brand-text { fill: #F9FAFB; }
    //   .solvify-tagline-text { fill: #D1D5DB; }
    // }
  `;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 80"
      className={`solvify-logo ${className}`}
      role="img"
      aria-label={title}
      {...props}
    >
      {/* Embed the style inside the SVG so styles are scoped to this document */}
      <style>{style}</style>

      <title>{title}</title>

      <defs>
        <linearGradient id="linkGradientReact" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="1" />
        </linearGradient>

        <filter id="glowReact" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Icon Section */}
      <g transform="translate(10, 10)">
        <path
          d="M30,10 C21.7157,10 15,16.7157 15,25 C15,33.2843 21.7157,40 30,40 L40,40 C45.5228,40 50,35.5228 50,30 C50,24.4772 45.5228,20 40,20 L30,20 C27.2386,20 25,22.2386 25,25 C25,27.7614 27.2386,30 30,30 L35,30"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M60,50 C68.2843,50 75,43.2843 75,35 C75,26.7157 68.2843,20 60,20 L50,20 C44.4772,20 40,24.4772 40,30 C40,35.5228 44.4772,40 50,40 L60,40 C62.7614,40 65,37.7614 65,35 C65,32.2386 62.7614,30 60,30 L55,30"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M40,20 L30,20 C27.2386,20 25,22.2386 25,25 C25,27.7614 27.2386,30 30,30 L40,30 C45.5228,30 50,34.4772 50,40 L60,40 C62.7614,40 65,37.7614 65,35 C65,32.2386 62.7614,30 60,30 L50,30 C44.4772,30 40,25.5228 40,20 Z"
          fill="url(#linkGradientReact)"
          opacity="0.7"
        />
        <circle cx="45" cy="30" r="3.5" fill="#10B981" filter="url(#glowReact)" />
      </g>

      {/* Text Section */}
      <g transform="translate(100, 22)">
        {/* React supports className on SVG elements; it will render as class in the DOM */}
        <text className="solvify-brand-text" fontSize="34" x="0" y="24">
          SOLVIFY
        </text>
        <text className="solvify-tagline-text" fontSize="13" x="0" y="45">
          Simplifying IT Solutions
        </text>
      </g>
    </svg>
  );
};

export default SolvifyLogo;
