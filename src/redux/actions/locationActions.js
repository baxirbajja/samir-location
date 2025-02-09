import {
  SET_LOCATIONS,
  ADD_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
  SET_LOCATION_LOADING,
  SET_LOCATION_ERROR,
  SET_RESERVATIONS,
  ADD_RESERVATION
} from './types';

export const setLocations = (locations) => {
  localStorage.setItem('locations', JSON.stringify(locations));
  return {
    type: SET_LOCATIONS,
    payload: locations
  };
};

export const addLocation = (location) => {
  const locations = JSON.parse(localStorage.getItem('locations') || '[]');
  locations.push(location);
  localStorage.setItem('locations', JSON.stringify(locations));
  return {
    type: ADD_LOCATION,
    payload: location
  };
};

export const updateLocation = (location) => {
  const locations = JSON.parse(localStorage.getItem('locations') || '[]');
  const index = locations.findIndex(loc => loc.id === location.id);
  if (index !== -1) {
    locations[index] = location;
    localStorage.setItem('locations', JSON.stringify(locations));
  }
  return {
    type: UPDATE_LOCATION,
    payload: location
  };
};

export const deleteLocation = (locationId) => {
  const locations = JSON.parse(localStorage.getItem('locations') || '[]');
  const filteredLocations = locations.filter(loc => loc.id !== locationId);
  localStorage.setItem('locations', JSON.stringify(filteredLocations));
  return {
    type: DELETE_LOCATION,
    payload: locationId
  };
};

export const setLocationLoading = (loading) => ({
  type: SET_LOCATION_LOADING,
  payload: loading
});

export const setLocationError = (error) => ({
  type: SET_LOCATION_ERROR,
  payload: error
});

export const setReservations = (reservations) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
  return {
    type: SET_RESERVATIONS,
    payload: reservations
  };
};

export const addReservation = (reservation) => {
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
  reservations.push(reservation);
  localStorage.setItem('reservations', JSON.stringify(reservations));
  return {
    type: ADD_RESERVATION,
    payload: reservation
  };
};
