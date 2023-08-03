import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useField } from 'formik';
import { DatePicker, DatePickerInput, TimePicker } from '@carbon/react';
import { formatDate, toOmrsDateFormat } from '@openmrs/esm-framework';
import { fieldRequiredErrCode, isEmpty } from '../../../validators/ohri-form-validator';
import { getConceptNameAndUUID, isInlineView } from '../../../utils/ohri-form-helper';
import { isTrue } from '../../../utils/boolean-utils';
import { OHRIFormFieldProps } from '../../../api/types';
import { OHRIFormContext } from '../../../ohri-form-context';
import { OHRIFieldValueView } from '../../value/view/ohri-field-value-view.component';
import { PreviousValueReview } from '../../previous-value-review/previous-value-review.component';
import styles from './ohri-date.scss';

const OHRIDate: React.FC<OHRIFormFieldProps> = ({ question, onChange, handler }) => {
  const [field, meta] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout, fields } = React.useContext(OHRIFormContext);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [conceptName, setConceptName] = useState('Loading...');
  const isFieldRequiredError = useMemo(() => errors[0]?.errCode == fieldRequiredErrCode, [errors]);
  const [previousValueForReview, setPreviousValueForReview] = useState(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    if (question['submission']) {
      question['submission'].errors && setErrors(question['submission'].errors);
      question['submission'].warnings && setWarnings(question['submission'].warnings);
    }
  }, [question['submission']]);

  const isInline = useMemo(() => {
    if (encounterContext.sessionMode == 'view' || isTrue(question.readonly)) {
      return isInlineView(question.inlineRendering, layoutType, workspaceLayout);
    }
    return false;
  }, [encounterContext.sessionMode, question.readonly, question.inlineRendering, layoutType, workspaceLayout]);

  const onDateChange = ([date]) => {
    setFieldValue(question.id, date);
    onChange(question.id, date, setErrors, setWarnings);
    question.value = handler?.handleFieldSubmission(question, date, encounterContext);
    return;
  };

/*  useEffect(() => {
    if (encounterContext?.previousEncounter && !isTrue(question.questionOptions.usePreviousValueDisabled)) {
      let prevValue = handler?.getPreviousValue(question, encounterContext?.previousEncounter, fields);

      if (!isEmpty(prevValue?.value)) {
        if (question?.questionOptions.rendering === 'datetime') {
          const rawDate = new Date(prevValue.value);

          prevValue = {
            display: dayjs(prevValue.value).format('M/D/YYYY HH:mm'),
            value: [rawDate],
          };
        } else {
          prevValue.display = dateFormatter.format(prevValue.value);
          prevValue.value = [prevValue.value];
        }
        setPreviousValueForReview(prevValue);
      }
    }
  }, [encounterContext?.previousEncounter]);*/

  useEffect(() => {
    getConceptNameAndUUID(question.questionOptions.concept).then(conceptTooltip => {
      setConceptName(conceptTooltip);
    });
  }, [conceptName]);

  return encounterContext.sessionMode == 'view' || isTrue(question.readonly) ? (
    <OHRIFieldValueView
      label={question.label}
      value={field.value instanceof Date ? getDisplay(field.value, question.questionOptions.rendering) : field.value}
      conceptName={conceptName}
      isInline={isInline}
    />
  ) : (
    !question.isHidden && (
      <>
        <div className={`${styles.formField} ${styles.row} ${styles.datetime}`}>
          <div>
            <DatePicker
              datePickerType="single"
              onChange={onDateChange}
              // Investigate these styles
              className={`${styles.datePickerOverrides} ${isFieldRequiredError ? styles.errorLabel : ''} ${
                question.disabled || isTrue(question.readonly) ? styles.disabled : ''
              }`}
              dateFormat="YYYY-MM-DD">
              <DatePickerInput
                id={question.id}
                labelText={question.label}
                disabled={question.disabled}
                invalid={!isFieldRequiredError && errors.length > 0}
                invalidText={errors[0]?.message}
                value={ field.value instanceof Date ? dayjs(field.value).format("YYYY-MM-DD") : field.value }
                warn={warnings.length > 0}
                warnText={warnings[0]?.message}
              />
            </DatePicker>
          </div>
          {previousValueForReview && (
            <div className={`${styles.formField}`}>
              <PreviousValueReview
                value={previousValueForReview.value}
                displayText={previousValueForReview.display}
                setValue={onDateChange}
              />
            </div>
          )}
        </div>
      </>
    )
  );
};

function getDisplay(date: Date, rendering: string) {
  const dateString = date.toLocaleDateString(window.navigator.language);
  if (rendering == 'datetime') {
    return `${dateString} ${date.toLocaleTimeString()}`;
  }
  return dateString;
}
export default OHRIDate;
