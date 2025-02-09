import {
  SET_UTILISATEUR,
  LOGOUT,
  SET_AUTH_LOADING,
  SET_AUTH_ERROR
} from '../actions/types';

const initialState = {
  utilisateurActuel: JSON.parse(localStorage.getItem('currentUser')) || null,
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UTILISATEUR:
      return {
        ...state,
        utilisateurActuel: action.payload,
        error: null
      };
    case LOGOUT:
      return {
        ...state,
        utilisateurActuel: null,
        error: null
      };
    case SET_AUTH_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_AUTH_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
