import { type OpenmrsResource } from '@openmrs/esm-framework';
import { type FormContextProps } from '../provider/form-provider';
import { type FormField, type FormFieldValueAdapter, type FormProcessorContextProps } from '../types';
import { gracefullySetSubmission } from '../utils/common-utils';

export const EncounterProviderAdapter: FormFieldValueAdapter = {
  transformFieldValue: function (field: FormField, value: any, context: FormContextProps) {
    gracefullySetSubmission(field, value, null);
  },
  getInitialValue: function (field: FormField, sourceObject: OpenmrsResource, context: FormProcessorContextProps) {
    const encounter = sourceObject ?? context.previousDomainObjectValue;
    if (encounter && encounter['encounterProviders']?.length) {
      const lastProviderIndex = encounter['encounterProviders'].length - 1;
      return encounter['encounterProviders'][lastProviderIndex].provider.uuid;
    }
    return context.currentProvider.uuid;
  },
  getPreviousValue: function (field: FormField, sourceObject: OpenmrsResource, context: FormProcessorContextProps) {
    const encounter = sourceObject ?? context.previousDomainObjectValue;
    if (encounter) {
      return this.getInitialValue(field, encounter, context);
    }
    return null;
  },
  getDisplayValue: function (field: FormField, value: any) {
    if (value?.display) {
      return value.display;
    }
    return value;
  },
  tearDown: function (): void {
    return;
  },
};