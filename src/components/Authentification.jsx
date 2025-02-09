import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Authentification = ({ setUtilisateurActuel }) => {
  const [estConnexion, setEstConnexion] = useState(true);
  const [donneesFormulaire, setDonneesFormulaire] = useState({
    email: '',
    motDePasse: '',
    nom: ''
  });
  const naviguer = useNavigate();

  const gererSoumission = async (e) => {
    e.preventDefault();
    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
    
    if (estConnexion) {
      // Login
      const utilisateur = utilisateurs.find(
        u => u.email === donneesFormulaire.email && 
        u.motDePasse === donneesFormulaire.motDePasse
      );

      if (utilisateur) {
        try {
          localStorage.setItem('currentUser', JSON.stringify(utilisateur));
          setUtilisateurActuel(utilisateur);
          naviguer('/locations');
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          alert('Une erreur est survenue lors de la connexion');
        }
      } else {
        alert('Email ou mot de passe incorrect');
      }
    } else {
      // Register
      if (utilisateurs.some(u => u.email === donneesFormulaire.email)) {
        alert('Cet email est déjà utilisé');
        return;
      }

      try {
        const nouvelUtilisateur = {
          ...donneesFormulaire,
          id: Date.now(),
          estAdmin: false,
          dateCreation: new Date().toISOString()
        };

        utilisateurs.push(nouvelUtilisateur);
        localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
        localStorage.setItem('currentUser', JSON.stringify(nouvelUtilisateur));
        setUtilisateurActuel(nouvelUtilisateur);
        naviguer('/locations');
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Une erreur est survenue lors de l\'inscription');
      }
    }
  };

  const gererChangement = (e) => {
    const { name, value } = e.target;
    setDonneesFormulaire(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-sm-5">
              <div className="text-center mb-4">
                <h1 className="h3 mb-3 fw-normal">{estConnexion ? 'Connexion' : 'Inscription'}</h1>
                <p className="text-muted">
                  {estConnexion 
                    ? 'Connectez-vous à votre compte' 
                    : 'Créez votre compte pour commencer'}
                </p>
              </div>

              <form onSubmit={gererSoumission} className="needs-validation">
                {!estConnexion && (
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nom"
                      name="nom"
                      placeholder="Votre nom"
                      value={donneesFormulaire.nom}
                      onChange={gererChangement}
                      required
                    />
                    <label htmlFor="nom">Nom</label>
                  </div>
                )}

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="nom@exemple.com"
                    value={donneesFormulaire.email}
                    onChange={gererChangement}
                    required
                  />
                  <label htmlFor="email">Adresse email</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="motDePasse"
                    name="motDePasse"
                    placeholder="Mot de passe"
                    value={donneesFormulaire.motDePasse}
                    onChange={gererChangement}
                    required
                  />
                  <label htmlFor="motDePasse">Mot de passe</label>
                </div>

                <button 
                  type="submit" 
                  className="w-100 btn btn-primary btn-lg mb-3"
                >
                  {estConnexion ? 'Se connecter' : "S'inscrire"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none"
                    onClick={() => {
                      setEstConnexion(!estConnexion);
                      setDonneesFormulaire({
                        email: '',
                        motDePasse: '',
                        nom: ''
                      });
                    }}
                  >
                    {estConnexion 
                      ? "Pas encore de compte ? Inscrivez-vous" 
                      : "Déjà inscrit ? Connectez-vous"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentification;
