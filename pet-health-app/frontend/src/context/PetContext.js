import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const PetContext = createContext();

const initialState = {
  pets: [],
  currentPet: null,
  loading: false,
  error: null,
};

const petReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'GET_PETS':
      return {
        ...state,
        pets: action.payload,
        loading: false,
      };
    case 'ADD_PET':
      return {
        ...state,
        pets: [action.payload, ...state.pets],
        loading: false,
      };
    case 'UPDATE_PET':
      return {
        ...state,
        pets: state.pets.map(pet =>
          pet._id === action.payload._id ? action.payload : pet
        ),
        loading: false,
      };
    case 'DELETE_PET':
      return {
        ...state,
        pets: state.pets.filter(pet => pet._id !== action.payload),
        loading: false,
      };
    case 'SET_CURRENT_PET':
      return {
        ...state,
        currentPet: action.payload,
      };
    case 'CLEAR_CURRENT_PET':
      return {
        ...state,
        currentPet: null,
      };
    case 'PET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const PetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(petReducer, initialState);

  // Get all pets
  const getPets = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('http://localhost:5000/api/pets');
      dispatch({
        type: 'GET_PETS',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'PET_ERROR',
        payload: err.response?.data?.message || 'Error fetching pets',
      });
    }
  };

  // Add pet
  const addPet = async (petData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('http://localhost:5000/api/pets', petData);
      dispatch({
        type: 'ADD_PET',
        payload: res.data.pet,
      });
    } catch (err) {
      dispatch({
        type: 'PET_ERROR',
        payload: err.response?.data?.message || 'Error adding pet',
      });
    }
  };

  // Update pet
  const updatePet = async (id, petData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`http://localhost:5000/api/pets/${id}`, petData);
      dispatch({
        type: 'UPDATE_PET',
        payload: res.data.pet,
      });
    } catch (err) {
      dispatch({
        type: 'PET_ERROR',
        payload: err.response?.data?.message || 'Error updating pet',
      });
    }
  };

  // Delete pet
  const deletePet = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`http://localhost:5000/api/pets/${id}`);
      dispatch({
        type: 'DELETE_PET',
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: 'PET_ERROR',
        payload: err.response?.data?.message || 'Error deleting pet',
      });
    }
  };

  // Set current pet
  const setCurrentPet = (pet) => {
    dispatch({
      type: 'SET_CURRENT_PET',
      payload: pet,
    });
  };

  // Clear current pet
  const clearCurrentPet = () => {
    dispatch({ type: 'CLEAR_CURRENT_PET' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <PetContext.Provider
      value={{
        pets: state.pets,
        currentPet: state.currentPet,
        loading: state.loading,
        error: state.error,
        getPets,
        addPet,
        updatePet,
        deletePet,
        setCurrentPet,
        clearCurrentPet,
        clearErrors,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

export default PetContext;
