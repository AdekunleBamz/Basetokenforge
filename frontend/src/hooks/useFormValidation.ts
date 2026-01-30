"use client";

import { useState, useEffect } from "react";

interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

interface FieldValidation {
  isValid: boolean;
  error: string | null;
  touched: boolean;
}

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule[]>>,
  options: UseFormValidationOptions = {}
) {
  const { validateOnChange = true, validateOnBlur = true } = options;
  
  const [values, setValues] = useState<T>(initialValues);
  const [validations, setValidations] = useState<Record<string, FieldValidation>>(() => {
    const initial: Record<string, FieldValidation> = {};
    for (const key of Object.keys(initialValues)) {
      initial[key] = { isValid: true, error: null, touched: false };
    }
    return initial;
  });

  const validateField = (name: keyof T, value: string): FieldValidation => {
    const rules = validationRules[name] || [];
    
    for (const rule of rules) {
      if (!rule.validate(value)) {
        return { isValid: false, error: rule.message, touched: true };
      }
    }
    
    return { isValid: true, error: null, touched: true };
  };

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      const validation = validateField(name, value);
      setValidations((prev) => ({ ...prev, [name as string]: validation }));
    }
  };

  const handleBlur = (name: keyof T) => {
    if (validateOnBlur) {
      const validation = validateField(name, values[name]);
      setValidations((prev) => ({ ...prev, [name as string]: validation }));
    }
  };

  const validateAll = (): boolean => {
    let isValid = true;
    const newValidations: Record<string, FieldValidation> = {};
    
    for (const [key, value] of Object.entries(values)) {
      const validation = validateField(key as keyof T, value);
      newValidations[key] = validation;
      if (!validation.isValid) {
        isValid = false;
      }
    }
    
    setValidations(newValidations);
    return isValid;
  };

  const resetValidation = () => {
    const initial: Record<string, FieldValidation> = {};
    for (const key of Object.keys(values)) {
      initial[key] = { isValid: true, error: null, touched: false };
    }
    setValidations(initial);
  };

  const isFormValid = Object.values(validations).every(
    (v) => v.isValid || !v.touched
  );

  return {
    values,
    setValues,
    validations,
    handleChange,
    handleBlur,
    validateAll,
    validateField,
    resetValidation,
    isFormValid,
  };
}

// Common validation rules
export const validationRules = {
  required: (message = "This field is required"): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => regex.test(value),
    message,
  }),
  
  positiveNumber: (message = "Must be a positive number"): ValidationRule => ({
    validate: (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    message,
  }),
  
  noSpecialChars: (message = "No special characters allowed"): ValidationRule => ({
    validate: (value) => /^[a-zA-Z0-9\s]*$/.test(value),
    message,
  }),
  
  uppercase: (message = "Must be uppercase"): ValidationRule => ({
    validate: (value) => value === value.toUpperCase(),
    message,
  }),
};
