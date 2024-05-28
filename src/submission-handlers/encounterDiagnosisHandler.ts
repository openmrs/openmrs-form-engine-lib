import { gracefullySetSubmission } from '../utils/common-utils';
import { type EncounterContext, type FormField, type OpenmrsEncounter, type SubmissionHandler } from '..';

export const EncounterDiagnosisHandler: SubmissionHandler = {
  handleFieldSubmission: (field: FormField, value: any, context: EncounterContext) => {
    const newValue = constructNewDiagnosis(value, field, context.patient.id);
    gracefullySetSubmission(field, newValue, null);
    return newValue;
  },
  getInitialValue: (
    encounter: OpenmrsEncounter,
    field: FormField,
    allFormFields: Array<FormField>,
    context: EncounterContext,
  ) => {
    if (encounter?.diagnoses?.length > 0) {
      if(field.questionOptions.rank === 1) {
        return encounter.diagnoses.find((entry) => entry.voided === false && field.questionOptions.rank === entry.rank)?.diagnosis
        ?.coded?.uuid;
      } else {
        return encounter.diagnoses.find((entry) => entry.voided === false && field.questionOptions.rank !== entry.rank)?.diagnosis
        ?.coded?.uuid;
      }
    } else {
      return;
    }
  },

  getDisplayValue: (field: FormField, value: any) => {
    return value;
  },
  getPreviousValue: (field: FormField, encounter: OpenmrsEncounter, allFormFields: Array<FormField>) => {
    return null;
  }
};

const constructNewDiagnosis = (value: any, field: FormField, patientUuid: string) => {
  if (!value) {
    return null;
  }
  return {
    patient: patientUuid,
    condition: null,
    diagnosis: {
      coded: value,
    },
    certainty: 'CONFIRMED',
    rank: field.questionOptions.rank, // rank 1 denotes a diagnosis is primary, else secondary
  };
};