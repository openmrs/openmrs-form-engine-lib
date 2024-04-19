import { map } from 'rxjs/operators';
import { SubmissionHandler } from '..';
import { OpenmrsEncounter, OHRIFormField } from '../api/types';
import { EncounterContext } from '../ohri-form-context';


export const OrdersHandler: SubmissionHandler = {
  handleFieldSubmission: (field: OHRIFormField, value: any, context: EncounterContext) => {
    const constructOrder =  {
        action: 'new',
        urgency: 'ROUTINE',
        patient: context.patient?.id,
        concept: value,
        type: field?.questionOptions?.orderType,
        careSetting: field?.questionOptions?.careSetting,
      };
    context.setOrders(context.orders.push(constructOrder));
    return constructOrder;
  },

  getInitialValue: (
    encounter: OpenmrsEncounter,
    field: OHRIFormField,
    allFormFields: Array<OHRIFormField>,
    context: EncounterContext,
  ) => {
    if (encounter) {
      const rendering = field.questionOptions.rendering;
      if (rendering == 'ui-select-extended') {
        if(field?.questionOptions) {
          console.log("===field?.questionOptions.concept", field?.questionOptions.concept)
          return field?.questionOptions.concept;
        }
      }
      return;
    } else {
      return;
    }
  },

  getDisplayValue: (field: OHRIFormField, value) => {
    return value;
  },

  getPreviousValue: (field: OHRIFormField, encounter: OpenmrsEncounter, allFormFields: Array<OHRIFormField>) => {
    console.log("===previous order", encounter?.orders)
    const order = encounter?.orders?.[0];
    return order ? { value: order.uuid, display: order.display} : null;
  },
};