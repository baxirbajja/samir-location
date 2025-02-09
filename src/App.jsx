import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import authReducer from './redux/reducers/authReducer';
import { logout } from './redux/actions/authActions';
import Authentification from './components/Authentification';
import Locations from './components/Locations';
import TableauBordAdmin from './components/TableauBordAdmin';
import './App.css';

const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer);

function App() {
  const auth = useSelector(state => state.auth);
  const { utilisateurActuel, loading } = auth;
  const dispatch = useDispatch();

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
    dispatch(logout());
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
                  <Authentification />
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

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;
