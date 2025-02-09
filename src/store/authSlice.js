import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  utilisateurActuel: JSON.parse(localStorage.getItem('currentUser')) || null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUtilisateur: (state, action) => {
      state.utilisateurActuel = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.utilisateurActuel = null;
      localStorage.removeItem('currentUser');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUtilisateur, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
