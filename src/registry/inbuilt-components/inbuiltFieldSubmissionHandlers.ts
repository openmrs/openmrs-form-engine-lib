import { SubmissionHandler } from '../../api/types';
import { ObsSubmissionHandler, EncounterLocationSubmissionHandler } from '../../submission-handlers/base-handlers';
import { EncounterDatetimeHandler } from '../../submission-handlers/encounterDatetimeHandler';
import { OrderSubmissionHandler } from '../../submission-handlers/orderHandler';
import { RegistryItem } from '../registry';

/**
 * @internal
 */
export const inbuiltFieldSubmissionHandlers: Array<RegistryItem<SubmissionHandler>> = [
  {
    name: 'ObsSubmissionHandler',
    component: ObsSubmissionHandler,
    type: 'obs',
  },
  {
    name: 'OrderSubmissionHandler',
    component: OrderSubmissionHandler,
    type: 'orders',
  },
  {
    name: 'ObsGroupHandler',
    component: ObsSubmissionHandler,
    type: 'obsGroup',
  },
  {
    name: 'EncounterLocationSubmissionHandler',
    component: EncounterLocationSubmissionHandler,
    type: 'encounterLocation',
  },
  {
    name: 'EncounterDatetimeHandler',
    component: EncounterDatetimeHandler,
    type: 'encounterDatetime',
  },
];
