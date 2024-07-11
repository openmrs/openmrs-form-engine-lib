import React, { type ReactNode } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type FormNode } from '../utils/expression-runner';
import { type FormProcessorContextProps } from '../types';
import { type FormField } from '../types/schema';

export interface FormContextProps extends FormProcessorContextProps {
  methods: UseFormReturn<any>;
  workspaceLayout: 'minimized' | 'maximized';
  isSubmitting?: boolean;
  evalExpression?: (expression: string, node: FormNode, value?: any) => string;
  getFormField?: (field: string) => FormField;
  addFormField?: (field: FormField) => void;
  removeFormField?: (fieldId: string) => void;
  addInvalidField?: (field: FormField) => void;
  removeInvalidField?: (fieldId: string) => void;
  setInvalidFields?: (fields: FormField[]) => void;
}

export interface FormProviderProps extends FormContextProps {
  children: ReactNode;
}

export const FormContext = React.createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ methods, children, ...contextProps }: FormProviderProps) => {
  return <FormContext.Provider value={{ ...contextProps, methods }}>{children}</FormContext.Provider>;
};

export const useFormProviderContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error('FormProviderContext must be used within a FormProviderContext');
  }

  return context;
};
