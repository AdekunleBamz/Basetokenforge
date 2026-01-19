/**
 * Form Context and Provider
 * 
 * Centralized form state management for token creation.
 */

"use client";

import { createContext, useContext, useReducer, ReactNode, useCallback } from "react";

interface TokenFormState {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  
  // Validation state
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  
  // Form status
  isSubmitting: boolean;
  isValid: boolean;
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof TokenFormState; value: string | number }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'CLEAR_ERROR'; field: string }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'RESET' };

const initialState: TokenFormState = {
  name: '',
  symbol: '',
  decimals: 18,
  initialSupply: '',
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: false,
};

function formReducer(state: TokenFormState, action: FormAction): TokenFormState {
  switch (action.type) {
    case 'SET_FIELD':
      const newState = {
        ...state,
        [action.field]: action.value,
      };
      // Recalculate validity
      newState.isValid = !!(
        newState.name.length > 0 &&
        newState.symbol.length >= 2 &&
        newState.initialSupply.length > 0 &&
        Object.keys(newState.errors).length === 0
      );
      return newState;
      
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
        isValid: false,
      };
      
    case 'CLEAR_ERROR':
      const { [action.field]: _, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors,
      };
      
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };
      
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.value,
      };
      
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
}

interface FormContextValue {
  state: TokenFormState;
  setField: (field: keyof TokenFormState, value: string | number) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  setTouched: (field: string) => void;
  setSubmitting: (value: boolean) => void;
  reset: () => void;
  getFieldProps: (field: string) => {
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
}

const FormContext = createContext<FormContextValue | null>(null);

export function TokenFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = useCallback((field: keyof TokenFormState, value: string | number) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setError = useCallback((field: string, error: string) => {
    dispatch({ type: 'SET_ERROR', field, error });
  }, []);

  const clearError = useCallback((field: string) => {
    dispatch({ type: 'CLEAR_ERROR', field });
  }, []);

  const setTouched = useCallback((field: string) => {
    dispatch({ type: 'SET_TOUCHED', field });
  }, []);

  const setSubmitting = useCallback((value: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', value });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const getFieldProps = useCallback((field: string) => ({
    value: state[field as keyof TokenFormState] as string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'number' 
        ? parseInt(e.target.value, 10) 
        : e.target.value;
      setField(field as keyof TokenFormState, value);
    },
    onBlur: () => setTouched(field),
    error: state.errors[field],
    touched: state.touched[field] || false,
  }), [state, setField, setTouched]);

  return (
    <FormContext.Provider value={{
      state,
      setField,
      setError,
      clearError,
      setTouched,
      setSubmitting,
      reset,
      getFieldProps,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useTokenForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useTokenForm must be used within a TokenFormProvider');
  }
  return context;
}
