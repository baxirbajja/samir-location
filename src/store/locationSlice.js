import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locations: JSON.parse(localStorage.getItem('locations')) || [],
  reservations: JSON.parse(localStorage.getItem('reservations')) || [],
  loading: false,
  error: null
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
      localStorage.setItem('locations', JSON.stringify(action.payload));
    },
    addLocation: (state, action) => {
      state.locations.push(action.payload);
      localStorage.setItem('locations', JSON.stringify(state.locations));
    },
    updateLocation: (state, action) => {
      const index = state.locations.findIndex(loc => loc.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
        localStorage.setItem('locations', JSON.stringify(state.locations));
      }
    },
    deleteLocation: (state, action) => {
      state.locations = state.locations.filter(loc => loc.id !== action.payload);
      localStorage.setItem('locations', JSON.stringify(state.locations));
    },
    setReservations: (state, action) => {
      state.reservations = action.payload;
      localStorage.setItem('reservations', JSON.stringify(action.payload));
    },
    addReservation: (state, action) => {
      state.reservations.push(action.payload);
      localStorage.setItem('reservations', JSON.stringify(state.reservations));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setLocations,
  addLocation,
  updateLocation,
  deleteLocation,
  setReservations,
  addReservation,
  setLoading,
  setError
} = locationSlice.actions;

export default locationSlice.reducer;
