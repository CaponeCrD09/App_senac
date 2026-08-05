import { useState, useEffect, useMemo } from 'react';

// Helper para categorizar a oficina e definir cor e icone
const getCategoryInfo = (catStr = '') => {
  const str = catStr.toLowerCase();
  if (str.includes('programação') || str.includes('jogos') || str.includes('ti') || str.includes('tecnologia')) {
    return { color: 'var(--cat-tecnologia)', icon: '💻', badge: 'Tecnologia' };
  }
  if (str.includes('gestão') || str.includes('administração')) {
    return { color: 'var(--cat-gestao)', icon: '💼', badge: 'Gestão' };
  }
  if (str.includes('saúde') || str.includes('enfermagem')) {
    return { color: 'var(--cat-saude)', icon: '❤️', badge: 'Saúde' };
  }
  if (str.includes('criatividade') || str.includes('design') || str.includes('moda')) {
    return { color: 'var(--cat-criatividade)', icon: '💡', badge: 'Criatividade' };
  }
  if (str.includes('educação') || str.includes('biblioteca') || str.includes('ecos')) {
    return { color: 'var(--cat-educacao)', icon: '👥', badge: 'Educação' };
  }
  return { color: 'var(--cat-padrao)', icon: '📅', badge: 'Diversos' };
};

// Helper para descobrir o periodo pelo horario (ex: "10h às 11h30")
const getPeriodoFromHorario = (horarioStr) => {
  const match = horarioStr.match(/(\d+)h/);
  if (match) {
    const hora = parseInt(match[1], 10);
    if (hora >= 6 && hora < 12) return 'Manhã';
    if (hora >= 12 && hora < 18) return 'Tarde';
    if (hora >= 18) return 'Noite';
  }
  return 'Livre';
};

export default function Cronograma() {
  const [userData, setUserData] = useState(null);
  const [oficinas, setOficinas] = useState([]);
  const [periodoAtivo, setPeriodoAtivo] = useState('Manhã'); // Padrão
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      const parsed = JSON.parse(data);
      if (!parsed.visited) parsed.visited = []; // Inicia array de visitadas se nao existir
      setUserData(parsed);
      setPeriodoAtivo(parsed.period); // Inicia na aba correspondente ao acesso
    }

    // Carrega o JSON local
    fetch('/oficinas.json')
      .then(res => res.json())
      .then(data => {
        setOficinas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar oficinas:", err);
        setLoading(false);
      });
  }, []);

  // Expande as oficinas para que cada horario seja um card independente
  const cardsProcessados = useMemo(() => {
    let explodidos = [];
    
    oficinas.forEach(oficina => {
      const catInfo = getCategoryInfo(oficina.categoria);
      
      if (!oficina.horarios || oficina.horarios.length === 0) {
        // Oficina livre (exposicao)
        explodidos.push({
          ...oficina,
          horarioExibicao: 'Exposição',
          periodoStr: 'Livre',
          catInfo
        });
      } else {
        oficina.horarios.forEach(hr => {
          explodidos.push({
            ...oficina,
            horarioExibicao: hr,
            periodoStr: getPeriodoFromHorario(hr),
            catInfo
          });
        });
      }
    });

    // Ordena de forma basica por horario (pegando o primeiro numero)
    explodidos.sort((a, b) => {
      if (a.horarioExibicao === 'Exposição') return -1;
      if (b.horarioExibicao === 'Exposição') return 1;
      const hA = parseInt(a.horarioExibicao.match(/\d+/) || [0]) || 0;
      const hB = parseInt(b.horarioExibicao.match(/\d+/) || [0]) || 0;
      return hA - hB;
    });

    return explodidos;
  }, [oficinas]);

  // Filtra pelo periodo atual selecionado na aba (mostra Livres em todos)
  const cardsFiltrados = cardsProcessados.filter(card => 
    card.periodoStr === periodoAtivo || card.periodoStr === 'Livre'
  );

  const toggleVisita = (titulo) => {
    if (!userData) return;
    const isVisited = userData.visited.includes(titulo);
    let newVisited = [];
    if (isVisited) {
      newVisited = userData.visited.filter(t => t !== titulo);
    } else {
      newVisited = [...userData.visited, titulo];
    }
    
    const newData = { ...userData, visited: newVisited };
    setUserData(newData);
    localStorage.setItem('userData', JSON.stringify(newData));
  };

  if (!userData) return null;

  return (
    <div className="container" style={{ padding: '16px', maxWidth: '600px' }}>
      
      {/* Header Mobile Minimalista */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-senac-orange)' }}>Casa</span> Aberta
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Um dia inteiro de aprendizado prático
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '1.2rem' }}>📅</span>
        <h2 style={{ fontSize: '1.3rem', color: '#fff' }}>Programação</h2>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        {['Manhã', 'Tarde', 'Noite'].map(per => (
          <button 
            key={per}
            className={`tab-btn ${periodoAtivo === per ? 'active' : ''}`}
            onClick={() => setPeriodoAtivo(per)}
          >
            {per}
          </button>
        ))}
      </div>

      {/* Lista de Oficinas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
          Carregando programação...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '40px' }}>
          {cardsFiltrados.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '20px' }}>
              Nenhuma oficina programada para este período.
            </p>
          ) : (
            cardsFiltrados.map((card, index) => {
              const isVisited = userData.visited.includes(card.titulo);
              return (
                <div 
                  key={index} 
                  className={`timeline-card ${isVisited ? 'visited' : ''}`}
                  onClick={() => toggleVisita(card.titulo)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="timeline-indicator" style={{ backgroundColor: card.catInfo.color }}></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="category-badge" style={{ backgroundColor: card.catInfo.color }}>
                        {card.catInfo.icon} {card.catInfo.badge}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isVisited && <span title="Você já participou!" style={{ fontSize: '1.2rem' }}>✅</span>}
                        <span className="timeline-time">{card.horarioExibicao}</span>
                      </div>
                    </div>
                    <h3 className="timeline-title" style={{ textDecoration: isVisited ? 'line-through' : 'none', opacity: isVisited ? 0.7 : 1 }}>
                      {card.titulo}
                    </h3>
                    <div className="timeline-meta">
                      <div className="timeline-meta-item">
                        <span>📍</span>
                        <span>{card.local || 'Local não informado'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  );
}
