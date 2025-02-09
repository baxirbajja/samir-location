import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Authentification from './components/Authentification';
import Locations from './components/Locations';
import TableauBordAdmin from './components/TableauBordAdmin';
import './App.css';

function App() {
  const [utilisateurActuel, setUtilisateurActuel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setUtilisateurActuel(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const RequireAuth = ({ children }) => {
    if (loading) return null;
    if (!utilisateurActuel) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const RequireAdmin = ({ children }) => {
    if (loading) return null;
    if (!utilisateurActuel?.estAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUtilisateurActuel(null);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        {utilisateurActuel && (
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
              <Link className="navbar-brand" to="/locations">
                Plateforme de Location
              </Link>
              <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to="/locations">
                      Locations
                    </Link>
                  </li>
                  {utilisateurActuel.estAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        Administration
                      </Link>
                    </li>
                  )}
                </ul>
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <span className="nav-link">
                      <i className="bi bi-person-circle me-2"></i>
                      {utilisateurActuel.nom}
                    </span>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className="nav-link" 
                      to="/"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Déconnexion
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        )}

        <main className="flex-grow-1">
          <Routes>
            <Route 
              path="/" 
              element={
                utilisateurActuel ? (
                  <Navigate to="/locations" replace />
                ) : (
                  <Authentification setUtilisateurActuel={setUtilisateurActuel} />
                )
              } 
            />
            <Route 
              path="/locations" 
              element={
                <RequireAuth>
                  <Locations />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <RequireAdmin>
                  <TableauBordAdmin />
                </RequireAdmin>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
