import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import { useMemo } from 'react';
import { type FormSchema, type OpenmrsForm } from '../types';
import useSWRImmutable from 'swr/immutable';

export function useClobData(form: OpenmrsForm) {
  const valueReferenceUuid = useMemo(
    () => form?.resources?.find(({ name }) => name === 'JSON schema').valueReference,
    [form],
  );
  const { data, error } = useSWRImmutable<{ data: FormSchema }, Error>(
    valueReferenceUuid ? `${restBaseUrl}/clobdata/${valueReferenceUuid}` : null,
    openmrsFetch,
  );

  return {
    clobdata: data?.data,
    clobdataError: error || null,
    isLoadingClobData: (!data && !error) || false,
  };
}
