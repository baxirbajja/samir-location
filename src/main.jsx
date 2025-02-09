import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './index.css'

// Créer un utilisateur admin par défaut s'il n'existe pas
const creerAdminParDefaut = () => {
  const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
  const adminExiste = utilisateurs.some(user => user.estAdmin);
  
  if (!adminExiste) {
    const adminParDefaut = {
      id: Date.now(),
      nom: 'Administrateur',
      email: 'admin@admin.com',
      motDePasse: 'admin123',
      estAdmin: true
    };
    utilisateurs.push(adminParDefaut);
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
    console.log('Utilisateur admin créé avec succès');
  }
};

creerAdminParDefaut();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
