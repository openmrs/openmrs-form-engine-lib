import { type FormField } from '../types';
import { type EncounterContext } from '../form-context';
import { TestOrderSubmissionHandler } from './testOrderHandler';
import { EncounterDiagnosisHandler } from './encounterDiagnosisHandler';

const encounterContext: EncounterContext = {
  patient: {
    id: '833db896-c1f0-11eb-8529-0242ac130003',
  },
  location: {
    uuid: '41e6e516-c1f0-11eb-8529-0242ac130003',
  },
  encounter: {
    uuid: '873455da-3ec4-453c-b565-7c1fe35426be',
    obs: [],
  },
  sessionMode: 'enter',
  encounterDate: new Date(2020, 11, 29),
  setEncounterDate: (value) => {},
  encounterProvider: '2c95f6f5-788e-4e73-9079-5626911231fa',
  setEncounterProvider: jest.fn,
  setEncounterLocation: jest.fn,
  encounterRole: '8cb3a399-d18b-4b62-aefb-5a0f948a3809',
  setEncounterRole: jest.fn,
};

const encounterDiagnoses: FormField = {
  label: 'Test Diagnosis',
  id: 'diagnosIS',
  type: 'diagnosis',
  questionOptions: {
    rendering: 'repeating',
    rank: 1,
    datasource: {
      name: 'problem_datasource',
    },
  },
};

describe('EncounterDiagnosesSubmissionHandler - handleFieldSubmission', () => {
  it('should submit an encounter diagnosis', () => {
    const diagnosis = EncounterDiagnosisHandler.handleFieldSubmission(
      encounterDiagnoses,
      '128125AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      encounterContext,
    );
    expect(diagnosis).toEqual({
      patient: '833db896-c1f0-11eb-8529-0242ac130003',
      condition: null,
      diagnosis: {
        coded: '128125AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      },
      certainty: 'CONFIRMED',
      rank: 1,
    });
  });
});
