import { useState, useEffect } from 'react';
import Home from './Home';
import Cronograma from './Cronograma';

function App() {
  const [currentPage, setCurrentPage] = useState('loading');

  useEffect(() => {
    // Check if user is already registered
    const userData = localStorage.getItem('userData');
    if (userData) {
      setCurrentPage('cronograma');
    } else {
      setCurrentPage('home');
    }
  }, []);

  const handleLogin = () => {
    setCurrentPage('cronograma');
  };

  if (currentPage === 'loading') {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Carregando...</div>;
  }

  return (
    <>
      {currentPage === 'home' && <Home onLogin={handleLogin} />}
      {currentPage === 'cronograma' && <Cronograma />}
    </>
  );
}

export default App;
