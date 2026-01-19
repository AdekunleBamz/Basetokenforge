/**
 * Base Token Creation Flow Context
 * 
 * Manages the multi-step token creation wizard state.
 */

"use client";

import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";

// Form data types
export interface TokenFormData {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: string;
  description?: string;
}

// Wizard steps
export type CreationStep = 
  | 'details'      // Token name, symbol, decimals
  | 'supply'       // Initial supply
  | 'review'       // Review all details
  | 'confirm'      // Wallet confirmation
  | 'pending'      // Transaction pending
  | 'success'      // Token created
  | 'error';       // Error occurred

// Validation state
export interface ValidationState {
  name: { valid: boolean; message?: string };
  symbol: { valid: boolean; message?: string };
  decimals: { valid: boolean; message?: string };
  supply: { valid: boolean; message?: string };
}

// Context state
interface CreationFlowState {
  step: CreationStep;
  formData: TokenFormData;
  validation: ValidationState;
  transactionHash: `0x${string}` | null;
  tokenAddress: `0x${string}` | null;
  error: Error | null;
  isSubmitting: boolean;
}

// Actions
type CreationFlowAction =
  | { type: 'SET_STEP'; payload: CreationStep }
  | { type: 'UPDATE_FORM'; payload: Partial<TokenFormData> }
  | { type: 'SET_VALIDATION'; payload: Partial<ValidationState> }
  | { type: 'SET_TRANSACTION_HASH'; payload: `0x${string}` }
  | { type: 'SET_TOKEN_ADDRESS'; payload: `0x${string}` }
  | { type: 'SET_ERROR'; payload: Error }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

// Initial state
const initialState: CreationFlowState = {
  step: 'details',
  formData: {
    name: '',
    symbol: '',
    decimals: 18,
    initialSupply: '',
  },
  validation: {
    name: { valid: true },
    symbol: { valid: true },
    decimals: { valid: true },
    supply: { valid: true },
  },
  transactionHash: null,
  tokenAddress: null,
  error: null,
  isSubmitting: false,
};

// Reducer
function creationFlowReducer(
  state: CreationFlowState,
  action: CreationFlowAction
): CreationFlowState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload, error: null };
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_VALIDATION':
      return { ...state, validation: { ...state.validation, ...action.payload } };
    case 'SET_TRANSACTION_HASH':
      return { ...state, transactionHash: action.payload, step: 'pending' };
    case 'SET_TOKEN_ADDRESS':
      return { ...state, tokenAddress: action.payload, step: 'success' };
    case 'SET_ERROR':
      return { ...state, error: action.payload, step: 'error', isSubmitting: false };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context
interface CreationFlowContextValue extends CreationFlowState {
  setStep: (step: CreationStep) => void;
  updateForm: (data: Partial<TokenFormData>) => void;
  setValidation: (validation: Partial<ValidationState>) => void;
  setTransactionHash: (hash: `0x${string}`) => void;
  setTokenAddress: (address: `0x${string}`) => void;
  setError: (error: Error) => void;
  setSubmitting: (submitting: boolean) => void;
  reset: () => void;
  goNext: () => void;
  goBack: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
}

const CreationFlowContext = createContext<CreationFlowContextValue | null>(null);

// Step order
const STEP_ORDER: CreationStep[] = ['details', 'supply', 'review', 'confirm'];

// Provider
export function CreationFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(creationFlowReducer, initialState);

  const setStep = useCallback((step: CreationStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const updateForm = useCallback((data: Partial<TokenFormData>) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
  }, []);

  const setValidation = useCallback((validation: Partial<ValidationState>) => {
    dispatch({ type: 'SET_VALIDATION', payload: validation });
  }, []);

  const setTransactionHash = useCallback((hash: `0x${string}`) => {
    dispatch({ type: 'SET_TRANSACTION_HASH', payload: hash });
  }, []);

  const setTokenAddress = useCallback((address: `0x${string}`) => {
    dispatch({ type: 'SET_TOKEN_ADDRESS', payload: address });
  }, []);

  const setError = useCallback((error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Navigation
  const currentIndex = STEP_ORDER.indexOf(state.step);
  const canGoNext = currentIndex < STEP_ORDER.length - 1 && currentIndex >= 0;
  const canGoBack = currentIndex > 0;

  const goNext = useCallback(() => {
    if (canGoNext) {
      setStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [canGoNext, currentIndex, setStep]);

  const goBack = useCallback(() => {
    if (canGoBack) {
      setStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [canGoBack, currentIndex, setStep]);

  const value: CreationFlowContextValue = {
    ...state,
    setStep,
    updateForm,
    setValidation,
    setTransactionHash,
    setTokenAddress,
    setError,
    setSubmitting,
    reset,
    goNext,
    goBack,
    canGoNext,
    canGoBack,
  };

  return (
    <CreationFlowContext.Provider value={value}>
      {children}
    </CreationFlowContext.Provider>
  );
}

// Hook
export function useCreationFlow() {
  const context = useContext(CreationFlowContext);
  if (!context) {
    throw new Error('useCreationFlow must be used within CreationFlowProvider');
  }
  return context;
}
