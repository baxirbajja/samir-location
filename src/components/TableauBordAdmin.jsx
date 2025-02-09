import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TableauBordAdmin = () => {
  const [locations, setLocations] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const naviguer = useNavigate();
  const utilisateurActuel = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!utilisateurActuel || !utilisateurActuel.estAdmin) {
      naviguer('/');
      return;
    }
    chargerLocations();
  }, []);

  const chargerLocations = () => {
    const locationsStockees = JSON.parse(localStorage.getItem('locations') || '[]');
    setLocations(locationsStockees);
  };

  const gererApprobation = (locationId, statut) => {
    const locationsMAJ = locations.map(location => {
      if (location.id === locationId) {
        return { ...location, statut };
      }
      return location;
    });
    localStorage.setItem('locations', JSON.stringify(locationsMAJ));
    setLocations(locationsMAJ);
  };

  const gererSuppression = (locationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette location ?')) {
      const locationsMAJ = locations.filter(location => location.id !== locationId);
      localStorage.setItem('locations', JSON.stringify(locationsMAJ));
      setLocations(locationsMAJ);
    }
  };

  const locationsFiltrees = filtreStatut === 'tous' 
    ? locations 
    : locations.filter(location => location.statut === filtreStatut);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 mb-4">Gestion des Locations</h1>
          <div className="card">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <button 
                    className={`btn ${filtreStatut === 'tous' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltreStatut('tous')}
                  >
                    Toutes
                  </button>
                  <button 
                    className={`btn ${filtreStatut === 'enAttente' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltreStatut('enAttente')}
                  >
                    En attente
                  </button>
                  <button 
                    className={`btn ${filtreStatut === 'approuve' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltreStatut('approuve')}
                  >
                    Approuvées
                  </button>
                  <button 
                    className={`btn ${filtreStatut === 'rejete' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltreStatut('rejete')}
                  >
                    Rejetées
                  </button>
                </div>
                <span className="badge bg-primary">
                  {locationsFiltrees.length} location(s)
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Image</th>
                      <th>Titre</th>
                      <th>Propriétaire</th>
                      <th>Type</th>
                      <th>Prix/mois</th>
                      <th>Date de création</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationsFiltrees.map(location => (
                      <tr key={location.id}>
                        <td style={{ width: '100px' }}>
                          {location.photo && (
                            <img
                              src={location.photo}
                              alt={location.titre}
                              className="img-thumbnail"
                              style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                            />
                          )}
                        </td>
                        <td>{location.titre}</td>
                        <td>{location.nomUtilisateur}</td>
                        <td>{location.type}</td>
                        <td>{location.prix} DH</td>
                        <td>{formatDate(location.dateCreation)}</td>
                        <td>
                          <span className={`badge ${getStatutBadgeClass(location.statut)}`}>
                            {location.statut === 'enAttente' ? 'En attente' :
                             location.statut === 'approuve' ? 'Approuvée' : 'Rejetée'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {location.statut === 'enAttente' && (
                              <>
                                <button
                                  className="btn btn-success"
                                  onClick={() => gererApprobation(location.id, 'approuve')}
                                  title="Approuver"
                                >
                                  <i className="bi bi-check-lg"></i>
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => gererApprobation(location.id, 'rejete')}
                                  title="Rejeter"
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => gererSuppression(location.id)}
                              title="Supprimer"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauBordAdmin;
