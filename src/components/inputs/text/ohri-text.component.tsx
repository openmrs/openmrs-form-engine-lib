import React, { useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash-es/isEmpty';
import { TextInput } from '@carbon/react';
import { useField } from 'formik';
import { OHRIFormFieldProps } from '../../../api/types';
import { OHRIFormContext } from '../../../ohri-form-context';
import { fieldRequiredErrCode } from '../../../validators/ohri-form-validator';
import { isTrue } from '../../../utils/boolean-utils';
import { getConceptNameAndUUID, isInlineView } from '../../../utils/ohri-form-helper';
import { OHRIFieldValueView } from '../../value/view/ohri-field-value-view.component';
import styles from '../../section/ohri-form-section.scss';

const OHRIText: React.FC<OHRIFormFieldProps> = ({ question, onChange, handler, previousValue }) => {
  const [field, meta] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout, fields } = React.useContext(OHRIFormContext);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [conceptName, setConceptName] = useState('Loading...');
  const isFieldRequiredError = useMemo(() => errors[0]?.errCode == fieldRequiredErrCode, [errors]);

  useEffect(() => {
    if (question['submission']) {
      question['submission'].errors && setErrors(question['submission'].errors);
      question['submission'].warnings && setWarnings(question['submission'].warnings);
    }
  }, [question['submission']]);

  useEffect(() => {
    if (!isEmpty(previousValue)) {
      setFieldValue(question.id, previousValue.value);
      field['value'] = previousValue.value;
      field.onBlur(null);
    }
  }, [previousValue]);

  field.onBlur = () => {
    if (field.value && question.unspecified) {
      setFieldValue(`${question.id}-unspecified`, false);
    }
    if (previousValue !== field.value) {
      onChange(question.id, field.value, setErrors, setWarnings);
      question.value = handler?.handleFieldSubmission(question, field.value, encounterContext);
    }
  };

  const setPrevValue = (value: any) => {
    setFieldValue(question.id, value);
    field['value'] = value;
    field.onBlur(null);
  };

  useEffect(() => {
    getConceptNameAndUUID(question.questionOptions.concept).then((conceptTooltip) => {
      setConceptName(conceptTooltip);
    });
  }, [conceptName]);

  const isInline = useMemo(() => {
    if (encounterContext.sessionMode == 'view' || isTrue(question.readonly)) {
      return isInlineView(question.inlineRendering, layoutType, workspaceLayout);
    }
    return false;
  }, [encounterContext.sessionMode, question.readonly, question.inlineRendering, layoutType, workspaceLayout]);

  return encounterContext.sessionMode == 'view' ? (
    <OHRIFieldValueView label={question.label} value={field.value} conceptName={conceptName} isInline={isInline} />
  ) : (
    !question.isHidden && (
      <>
        <div className={`${styles.boldedLabel} ${isFieldRequiredError ? ` ${styles.errorLabel}` : ''}`}>
          <TextInput
            {...field}
            id={question.id}
            labelText={question.label}
            name={question.id}
            value={field.value || ''}
            onFocus={''}
            disabled={question.disabled}
            readOnly={question.readonly}
            invalid={!isFieldRequiredError && errors.length > 0}
            invalidText={errors.length && errors[0].message}
            warn={warnings.length > 0}
            warnText={warnings.length && warnings[0].message}
            onInvalid={(e) => e.preventDefault()}
            maxLength={question.questionOptions.max || TextInput.maxLength}
          />
        </div>
      </>
    )
  );
};

export default OHRIText;
