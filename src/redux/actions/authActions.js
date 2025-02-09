import {
  SET_UTILISATEUR,
  LOGOUT,
  SET_AUTH_LOADING,
  SET_AUTH_ERROR
} from './types';

export const setUtilisateur = (utilisateur) => {
  localStorage.setItem('currentUser', JSON.stringify(utilisateur));
  return {
    type: SET_UTILISATEUR,
    payload: utilisateur
  };
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  return {
    type: LOGOUT
  };
};

export const setAuthLoading = (loading) => ({
  type: SET_AUTH_LOADING,
  payload: loading
});

export const setAuthError = (error) => ({
  type: SET_AUTH_ERROR,
  payload: error
});
