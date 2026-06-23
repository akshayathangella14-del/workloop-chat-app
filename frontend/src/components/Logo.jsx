export default function Logo({ width = 32, height = 32, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* Glow Definition */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Connecting Paths (Network) */}
      <path
        d="M25 35 L50 20 L75 35 L75 65 L50 80 L25 65 Z"
        stroke="url(#edgeGradient)"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Inner Connections */}
      <path
        d="M25 35 L50 50 L75 35"
        stroke="rgba(34, 211, 238, 0.4)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 50 L50 80"
        stroke="rgba(34, 211, 238, 0.4)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Glowing Central Node */}
      <circle cx="50" cy="50" r="6" fill="#22D3EE" filter="url(#glow)" />
      
      {/* Peripheral Nodes */}
      <circle cx="25" cy="35" r="4" fill="#0F172A" stroke="#22D3EE" strokeWidth="2" />
      <circle cx="75" cy="35" r="4" fill="#0F172A" stroke="#22D3EE" strokeWidth="2" />
      <circle cx="75" cy="65" r="4" fill="#0F172A" stroke="#22D3EE" strokeWidth="2" />
      <circle cx="50" cy="80" r="4" fill="#0F172A" stroke="#22D3EE" strokeWidth="2" />
      <circle cx="25" cy="65" r="4" fill="#0F172A" stroke="#22D3EE" strokeWidth="2" />
      <circle cx="50" cy="20" r="5" fill="url(#accentGradient)" filter="url(#glow)" />
      
    </svg>
  );
}
