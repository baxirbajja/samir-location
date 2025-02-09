import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarteLocation from './CarteLocation'; // Import the CarteLocation component

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [locationEnEdition, setLocationEnEdition] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [utilisateurActuel, setUtilisateurActuel] = useState(null);
  const [nouvelleLocation, setNouvelleLocation] = useState({
    titre: '',
    description: '',
    type: '',
    prix: '',
    photo: '',
    latitude: null,
    longitude: null,
    adresse: ''
  });
  const naviguer = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      naviguer('/');
      return;
    }
    setUtilisateurActuel(user);
  }, [naviguer]);

  useEffect(() => {
    if (utilisateurActuel) {
      const locationsStockees = JSON.parse(localStorage.getItem('locations') || '[]');
      // Si l'utilisateur est admin, montrer toutes les locations, sinon filtrer
      const locationsFiltrees = utilisateurActuel.estAdmin 
        ? locationsStockees 
        : locationsStockees.filter(location => 
            location.utilisateurId === utilisateurActuel.id || 
            location.statut === 'approuve'
          );
      setLocations(locationsFiltrees);
      const reservationsStockees = JSON.parse(localStorage.getItem('reservations') || '[]');
      setReservations(reservationsStockees);
    }
  }, [utilisateurActuel]);

  const chargerLocations = () => {
    const locationsStockees = JSON.parse(localStorage.getItem('locations') || '[]');
    // Si l'utilisateur est admin, montrer toutes les locations, sinon filtrer
    const locationsFiltrees = utilisateurActuel.estAdmin 
      ? locationsStockees 
      : locationsStockees.filter(location => 
          location.utilisateurId === utilisateurActuel.id || 
          location.statut === 'approuve'
        );
    setLocations(locationsFiltrees);
  };

  const chargerReservations = () => {
    const reservationsStockees = JSON.parse(localStorage.getItem('reservations') || '[]');
    setReservations(reservationsStockees);
  };

  const gererChangementInput = (e) => {
    const { name, value } = e.target;
    setNouvelleLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const gererSoumissionFormulaire = (e) => {
    e.preventDefault();
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    
    if (modeEdition && locationEnEdition) {
      // Mise à jour d'une location existante
      const locationsMAJ = locations.map(loc => {
        if (loc.id === locationEnEdition.id) {
          return {
            ...loc,
            ...nouvelleLocation,
            dateModification: new Date().toISOString()
          };
        }
        return loc;
      });
      localStorage.setItem('locations', JSON.stringify(locationsMAJ));
    } else {
      // Création d'une nouvelle location
      const nouvelleLocationComplete = {
        ...nouvelleLocation,
        id: Date.now(),
        utilisateurId: utilisateurActuel.id,
        nomUtilisateur: utilisateurActuel.nom,
        dateCreation: new Date().toISOString(),
        statut: 'enAttente'
      };
      locations.push(nouvelleLocationComplete);
      localStorage.setItem('locations', JSON.stringify(locations));
    }

    // Réinitialisation du formulaire
    setNouvelleLocation({
      titre: '',
      description: '',
      type: '',
      prix: '',
      photo: '',
      latitude: null,
      longitude: null,
      adresse: ''
    });
    setAfficherFormulaire(false);
    setModeEdition(false);
    setLocationEnEdition(null);
    chargerLocations();
  };

  const gererEdition = (location) => {
    setNouvelleLocation({
      titre: location.titre,
      description: location.description,
      type: location.type,
      prix: location.prix,
      photo: location.photo,
      latitude: location.latitude,
      longitude: location.longitude,
      adresse: location.adresse
    });
    setLocationEnEdition(location);
    setModeEdition(true);
    setAfficherFormulaire(true);
  };

  const gererSuppression = (locationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette location ?')) {
      const locations = JSON.parse(localStorage.getItem('locations') || '[]');
      const locationsMAJ = locations.filter(loc => loc.id !== locationId);
      localStorage.setItem('locations', JSON.stringify(locationsMAJ));
      chargerLocations();
    }
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'approuve':
        return 'bg-success';
      case 'rejete':
        return 'bg-danger';
      case 'enAttente':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  const gererAction = (id, action) => {
    const locations = JSON.parse(localStorage.getItem('locations') || '[]');
    const locationsMAJ = locations.map(location => {
      if (location.id === id) {
        return action === 'approuver' 
          ? { ...location, statut: 'approuve' }
          : { ...location, statut: 'rejete' };
      }
      return location;
    });
    localStorage.setItem('locations', JSON.stringify(locationsMAJ));
    chargerLocations();
  };

  const gererReservation = (location) => {
    const nouvelleReservation = {
      id: Date.now(),
      locationId: location.id,
      utilisateurId: utilisateurActuel.id,
      nomUtilisateur: utilisateurActuel.nom,
      dateReservation: new Date().toISOString(),
      statut: 'enAttente',
      titre: location.titre
    };

    const reservationsActuelles = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Vérifier si l'utilisateur a déjà réservé cette location
    const reservationExistante = reservationsActuelles.find(
      r => r.locationId === location.id && r.utilisateurId === utilisateurActuel.id
    );

    if (reservationExistante) {
      alert('Vous avez déjà réservé cette location');
      return;
    }

    reservationsActuelles.push(nouvelleReservation);
    localStorage.setItem('reservations', JSON.stringify(reservationsActuelles));
    setReservations(reservationsActuelles);
    alert('Votre demande de réservation a été envoyée');
  };

  return (
    <div className="container py-4">
      {utilisateurActuel && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">Locations</h1>
            <button
              className="btn btn-primary"
              onClick={() => {
                setAfficherFormulaire(!afficherFormulaire);
                if (!afficherFormulaire) {
                  setModeEdition(false);
                  setLocationEnEdition(null);
                  setNouvelleLocation({
                    titre: '',
                    description: '',
                    type: '',
                    prix: '',
                    photo: '',
                    latitude: null,
                    longitude: null,
                    adresse: ''
                  });
                }
              }}
            >
              {afficherFormulaire ? 'Fermer' : 'Ajouter une location'}
            </button>
          </div>

          {afficherFormulaire && (
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="card-title h5 mb-4">
                  {modeEdition ? 'Modifier la location' : 'Nouvelle location'}
                </h2>
                <form onSubmit={gererSoumissionFormulaire}>
                  <div className="mb-3">
                    <label htmlFor="titre" className="form-label">Titre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="titre"
                      name="titre"
                      value={nouvelleLocation.titre}
                      onChange={gererChangementInput}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={nouvelleLocation.description}
                      onChange={gererChangementInput}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type de bien</label>
                    <select
                      className="form-select"
                      id="type"
                      name="type"
                      value={nouvelleLocation.type}
                      onChange={gererChangementInput}
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="Appartement">Appartement</option>
                      <option value="Maison">Maison</option>
                      <option value="Studio">Studio</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="prix" className="form-label">Prix par mois (DH)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="prix"
                      name="prix"
                      value={nouvelleLocation.prix}
                      onChange={gererChangementInput}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="photo" className="form-label">URL de la photo</label>
                    <input
                      type="url"
                      className="form-control"
                      id="photo"
                      name="photo"
                      value={nouvelleLocation.photo}
                      onChange={gererChangementInput}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Emplacement</label>
                    <CarteLocation
                      onLocationSelect={(locationData) => {
                        setNouvelleLocation(prev => ({
                          ...prev,
                          latitude: locationData.lat,
                          longitude: locationData.lng,
                          adresse: locationData.address
                        }));
                      }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {modeEdition ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {locations.map(location => (
              <div key={location.id} className="col">
                <div className="card h-100">
                  {location.photo && (
                    <img
                      src={location.photo}
                      className="card-img-top"
                      alt={location.titre}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{location.titre}</h5>
                      <span className={`badge ${getStatutBadgeClass(location.statut)}`}>
                        {location.statut === 'enAttente' ? 'En attente' :
                         location.statut === 'approuve' ? 'Approuvée' : 'Rejetée'}
                      </span>
                    </div>
                    <p className="card-text">{location.description}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Type: {location.type}<br />
                        Prix: {location.prix} DH/mois<br />
                        Propriétaire: {location.nomUtilisateur}<br />
                        {location.adresse && (
                          <>
                            Adresse: {location.adresse}
                          </>
                        )}
                      </small>
                    </p>
                  </div>
                  {(utilisateurActuel.id === location.utilisateurId && !utilisateurActuel.estAdmin) && (
                    <div className="card-footer bg-transparent">
                      <div className="btn-group w-100">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => gererEdition(location)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Modifier
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => gererSuppression(location.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                  {utilisateurActuel.estAdmin && (
                    <div className="card-footer bg-transparent">
                      <div className="btn-group w-100">
                        <button
                          className="btn btn-success"
                          onClick={() => gererAction(location.id, 'approuver')}
                        >
                          Approuver
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => gererAction(location.id, 'rejeter')}
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  )}
                  {(!utilisateurActuel.estAdmin && 
                    utilisateurActuel.id !== location.utilisateurId && 
                    location.statut === 'approuve') && (
                    <div className="card-footer bg-transparent">
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => gererReservation(location)}
                        disabled={reservations.some(
                          r => r.locationId === location.id && 
                              r.utilisateurId === utilisateurActuel.id
                        )}
                      >
                        <i className="bi bi-calendar-check me-1"></i>
                        {reservations.some(
                          r => r.locationId === location.id && 
                              r.utilisateurId === utilisateurActuel.id
                        ) ? 'Déjà réservé' : 'Réserver'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Locations;
