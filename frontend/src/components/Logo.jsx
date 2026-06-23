export default function Logo({ width = 32, height = 32, className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background shape */}
      <rect width="32" height="32" rx="10" fill="#0F172A" />
      
      {/* Connectivity nodes/paths indicating real-time and team workflow */}
      <path
        d="M11 11L16 16L21 11"
        stroke="#14B8A6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 16V22"
        stroke="#14B8A6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Glow/Accent dots */}
      <circle cx="11" cy="11" r="2.5" fill="#22D3EE" />
      <circle cx="21" cy="11" r="2.5" fill="#22D3EE" />
      <circle cx="16" cy="22" r="2.5" fill="#22D3EE" />
      <circle cx="16" cy="16" r="2.5" fill="#0F172A" stroke="#14B8A6" strokeWidth="2" />
    </svg>
  );
}
