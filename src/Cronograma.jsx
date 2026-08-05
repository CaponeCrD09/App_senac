import { useState, useEffect } from 'react';

export default function Cronograma() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  if (!userData) {
    return null; // ou um loader. O App.jsx já bloqueia isso antes.
  }

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="glass" style={{ padding: '30px', borderRadius: '16px' }}>
        <h1 style={{ color: 'var(--color-senac-orange)', marginBottom: '16px' }}>Cronograma</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
          Olá, <strong style={{ color: 'var(--color-text-primary)' }}>{userData.fullName}</strong>!
        </p>
        <p style={{ marginTop: '8px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
          Você está navegando no período da <strong>{userData.period}</strong>.
        </p>
      </div>
    </div>
  );
}
