// Fallback enquanto o código de uma página carrega (React.lazy): cabeçalho e cards em skeleton
function CarregandoPagina({ telaCheia = false }) {
  return (
    <div
      role="status"
      aria-label="Carregando página"
      className={telaCheia ? 'p-6 max-w-3xl mx-auto' : ''}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0 }}></div>
        <div className="flex flex-col gap-2 grow">
          <div className="skeleton" style={{ height: 20, width: '35%' }}></div>
          <div className="skeleton" style={{ height: 12, width: '55%' }}></div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card" style={{ padding: 'var(--space-5)' }}>
            <div className="flex items-start gap-6">
              <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }}></div>
              <div className="flex flex-col gap-2 grow">
                <div className="skeleton" style={{ height: 14, width: '55%' }}></div>
                <div className="skeleton" style={{ height: 11, width: '80%' }}></div>
                <div className="skeleton" style={{ height: 11, width: '40%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CarregandoPagina
