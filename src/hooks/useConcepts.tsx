import useSWRImmutable from 'swr/immutable';
import { openmrsFetch, OpenmrsResource } from '@openmrs/esm-framework';

const conceptRepresentation =
  'custom:(uuid,display,conceptMappings:(conceptReferenceTerm:(conceptSource:(name),code)))';

export function useConcepts(references: Set<string>) {
  const pageSize = 50;
   // TODO: handle paging (ie when number of concepts greater than default limit per page)
   const { data, error, isLoading } = useSWRImmutable<{ data: { results: Array<OpenmrsResource> } }, Error>(
    `/ws/rest/v1/concept?references=${Array.from(references).join(',')}&v=${conceptRepresentation}`,
    openmrsFetch,
  );

  const fetchConcepts = async (url:string) => {
    const response = await openmrsFetch(url);
    const totalCount = response.headers.get('X-Total-Count');
    const totalPages = Math.ceil(Number(totalCount)/pageSize);

    const results: OpenmrsResource[] = await response.json();
    let fetchedResults = results;

    const fetchPromises: Promise<OpenmrsResource[]>[] = [];
    for (let page = 2; page <= totalPages; page++) {
      const nextPageUrl = `${url}&startIndex=${(page - 1) * pageSize}&v=${conceptRepresentation}`;
      fetchPromises.push(openmrsFetch(nextPageUrl).then((res) => res.json()));
    }
     const remainingResults = await Promise.all(fetchPromises);
    remainingResults.forEach((pageResults) => {
      fetchedResults = fetchedResults.concat(pageResults);
    });

    return { results: fetchedResults };
  };
  
  return { concepts: data?.data.results, error, isLoading };
}


