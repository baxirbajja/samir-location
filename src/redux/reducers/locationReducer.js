import {
  SET_LOCATIONS,
  ADD_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
  SET_LOCATION_LOADING,
  SET_LOCATION_ERROR,
  SET_RESERVATIONS,
  ADD_RESERVATION
} from '../actions/types';

const initialState = {
  locations: JSON.parse(localStorage.getItem('locations')) || [],
  reservations: JSON.parse(localStorage.getItem('reservations')) || [],
  loading: false,
  error: null
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
        error: null
      };
    case ADD_LOCATION:
      return {
        ...state,
        locations: [...state.locations, action.payload],
        error: null
      };
    case UPDATE_LOCATION:
      return {
        ...state,
        locations: state.locations.map(location =>
          location.id === action.payload.id ? action.payload : location
        ),
        error: null
      };
    case DELETE_LOCATION:
      return {
        ...state,
        locations: state.locations.filter(location => location.id !== action.payload),
        error: null
      };
    case SET_LOCATION_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_LOCATION_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case SET_RESERVATIONS:
      return {
        ...state,
        reservations: action.payload
      };
    case ADD_RESERVATION:
      return {
        ...state,
        reservations: [...state.reservations, action.payload]
      };
    default:
      return state;
  }
};

export default locationReducer;
