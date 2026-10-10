export function ServicesBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      {/* Wavy wireframe mesh background to match the organic 3D aesthetic */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-screen"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FF4200" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Wavy Horizontal Lines */}
        {Array.from({ length: 24 }).map((_, i) => {
          const yOffset = i * 40;
          return (
            <path
              key={`h-wave-${i}`}
              d={`M0 ${yOffset} C 400 ${yOffset + 60}, 1000 ${yOffset - 60}, 1440 ${yOffset}`}
              stroke="url(#waveFade)"
              strokeWidth="1"
            />
          );
        })}

        {/* Wavy Vertical Lines */}
        {Array.from({ length: 36 }).map((_, i) => {
          const xOffset = i * 40;
          return (
            <path
              key={`v-wave-${i}`}
              d={`M${xOffset} 0 C ${xOffset + (i % 2 === 0 ? 30 : -30)} 450, ${xOffset - (i % 2 === 0 ? 30 : -30)} 900, ${xOffset} 1440`}
              stroke="url(#waveFade)"
              strokeWidth="0.8"
            />
          );
        })}
      </svg>
    </div>
  );
}


