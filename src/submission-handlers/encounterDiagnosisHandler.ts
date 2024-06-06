import { gracefullySetSubmission } from '../utils/common-utils';
import { type EncounterContext, type FormField, type OpenmrsEncounter, type SubmissionHandler } from '..';

export let assignedDiagnosisIds: string[] = [];

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
      assignedDiagnosisIds.push(encounter.diagnoses[0].diagnosis.coded.uuid);
      return encounter.diagnoses[0].diagnosis.coded.uuid;
    } else {
      return;
    }
  },

  getDisplayValue: (field: FormField, value: any) => {
    return value;
  },
  getPreviousValue: (field: FormField, encounter: OpenmrsEncounter, allFormFields: Array<FormField>) => {
    return null;
  },
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

export function teardownTestDiagnosisHandler() {
  assignedDiagnosisIds = [];
}
