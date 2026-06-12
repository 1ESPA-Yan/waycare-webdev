// Componente da garrafa SVG animada
// Recebe pct (0-100) e ml para exibir o nível da água

function GarrafaAnimada({ pct, ml, descricao = 'na garrafa agora' }) {
  // Cor da água muda conforme o nível
  const corAgua = pct >= 60
    ? 'rgba(74, 174, 232, 0.85)'
    : pct >= 30
    ? 'rgba(74, 174, 232, 0.65)'
    : 'rgba(74, 174, 232, 0.45)'

  // A água ocupa a parte de baixo da garrafa
  // O SVG tem altura 200px, a área do corpo começa em y=50 e vai até y=190
  // Área total do corpo = 140px
  const alturaCorpo = 140
  const alturaAgua = (pct / 100) * alturaCorpo
  const yAgua = 190 - alturaAgua

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg
        viewBox="0 0 80 200"
        width="80"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definições: clip para a água não sair da garrafa */}
        <defs>
          <clipPath id="bottle-clip">
            {/* Tampa */}
            <rect x="28" y="10" width="24" height="18" rx="4" />
            {/* Gargalo */}
            <path d="M28 28 Q20 38 18 50 L62 50 Q60 38 52 28 Z" />
            {/* Corpo */}
            <rect x="10" y="50" width="60" height="140" rx="8" />
          </clipPath>
        </defs>

        {/* === GARRAFA — fundo (vazia) === */}

        {/* Tampa */}
        <rect
          x="28" y="10" width="24" height="18" rx="4"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(122,209,195,0.5)"
          strokeWidth="1.5"
        />

        {/* Rótulo da tampa */}
        <rect
          x="30" y="14" width="20" height="3" rx="1.5"
          fill="rgba(122,209,195,0.3)"
        />

        {/* Gargalo */}
        <path
          d="M28 28 Q20 38 18 50 L62 50 Q60 38 52 28 Z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(122,209,195,0.5)"
          strokeWidth="1.5"
        />

        {/* Corpo */}
        <rect
          x="10" y="50" width="60" height="140" rx="8"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(122,209,195,0.5)"
          strokeWidth="1.5"
        />

        {/* === ÁGUA — animada via clipPath === */}
        <g clipPath="url(#bottle-clip)">
          {/* Bloco de água */}
          <rect
            x="0"
            y={yAgua}
            width="80"
            height={alturaAgua + 10}
            fill={corAgua}
            style={{ transition: 'y 0.6s ease, height 0.6s ease' }}
          />

          {/* Onda suave na superfície da água */}
          {pct > 0 && (
            <ellipse
              cx="40"
              cy={yAgua}
              rx="30"
              ry="4"
              fill="rgba(255,255,255,0.25)"
              style={{ transition: 'cy 0.6s ease' }}
            />
          )}
        </g>

        {/* === DETALHES VISUAIS sobre a garrafa === */}

        {/* Reflexo de luz no corpo */}
        <rect
          x="16" y="58" width="6" height="60" rx="3"
          fill="rgba(255,255,255,0.08)"
        />

        {/* Marcadores de nível */}
        <line x1="66" y1="100" x2="70" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="66" y1="120" x2="70" y2="120" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="66" y1="140" x2="70" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="66" y1="160" x2="70" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Percentual no centro da garrafa */}
        <text
          x="40"
          y={pct > 15 ? yAgua + alturaAgua / 2 + 5 : 175}
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
          style={{ transition: 'y 0.6s ease' }}
        >
          {pct}%
        </text>
      </svg>

      {/* ML abaixo da garrafa */}
      <span className="bottle-visual-ml">{ml} ml</span>
      <span className="bottle-visual-desc">{descricao}</span>
    </div>
  )
}

export default GarrafaAnimada