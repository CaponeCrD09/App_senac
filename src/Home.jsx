import { useState } from 'react';

export default function Home({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isFirstTime, setIsFirstTime] = useState('yes');

  const calculatePeriod = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Manhã';
    if (hour >= 12 && hour < 18) return 'Tarde';
    return 'Noite';
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const userData = {
      fullName: fullName.trim(),
      isFirstTime: isFirstTime === 'yes',
      registeredAt: new Date().toISOString(),
      period: calculatePeriod()
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    onLogin();
  };

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100vh' }}>
      <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--color-senac-orange)' }}>
          Casa Aberta
        </h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'var(--color-text-primary)' }}>
          Passaporte Senac
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '40px', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Bem-vindo ao evento! Registre sua presença e acompanhe as oficinas disponíveis durante o Casa Aberta Senac.
        </p>
        <button className="btn" style={{ padding: '16px 32px', fontSize: '1.2rem' }} onClick={() => setShowModal(true)}>
          Ver oficinas
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Identificação</h2>
              <p>Por favor, preencha seus dados para continuar</p>
            </div>
            
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="fullName">Nome Completo</label>
                <input 
                  type="text" 
                  id="fullName" 
                  className="input-field" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  required
                />
              </div>

              <div className="input-group">
                <label>É sua primeira vez no Senac?</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="firstTime" 
                      value="yes"
                      checked={isFirstTime === 'yes'}
                      onChange={(e) => setIsFirstTime(e.target.value)}
                    />
                    <span>Sim</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="firstTime" 
                      value="no"
                      checked={isFirstTime === 'no'}
                      onChange={(e) => setIsFirstTime(e.target.value)}
                    />
                    <span>Não</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn" disabled={!fullName.trim()}>
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
