import React, { useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash-es/isEmpty';
import { useTranslation } from 'react-i18next';
import { Layer, TextInput } from '@carbon/react';
import { useField } from 'formik';
import { type FormFieldProps } from '../../../types';
import { FormContext } from '../../../form-context';
import { isTrue } from '../../../utils/boolean-utils';
import { isInlineView } from '../../../utils/form-helper';
import FieldValueView from '../../value/view/field-value-view.component';
import RequiredFieldLabel from '../../required-field-label/required-field-label.component';
import styles from './text.scss';
import { useFieldValidationResults } from '../../../hooks/useFieldValidationResults';

const TextField: React.FC<FormFieldProps> = ({ question, onChange, handler, previousValue }) => {
  const { t } = useTranslation();
  const [field] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout } = React.useContext(FormContext);
  const { errors, warnings, setErrors, setWarnings } = useFieldValidationResults(question);

  useEffect(() => {
    if (!isEmpty(previousValue)) {
      const { value } = previousValue;
      setFieldValue(question.id, value);
      field['value'] = value;
      field.onBlur(null);
    }
  }, [previousValue]);

  field.onBlur = () => {
    if (field.value && question.unspecified) {
      setFieldValue(`${question.id}-unspecified`, false);
    }
    if (previousValue !== field.value) {
      onChange(question.id, field.value, setErrors, setWarnings);
      handler?.handleFieldSubmission(question, field.value, encounterContext);
    }
  };

  const isInline = useMemo(() => {
    if (['view', 'embedded-view'].includes(encounterContext.sessionMode) || isTrue(question.readonly)) {
      return isInlineView(question.inlineRendering, layoutType, workspaceLayout, encounterContext.sessionMode);
    }
    return false;
  }, [encounterContext.sessionMode, question.readonly, question.inlineRendering, layoutType, workspaceLayout]);

  return encounterContext.sessionMode == 'view' || encounterContext.sessionMode == 'embedded-view' ? (
    <FieldValueView
      label={t(question.label)}
      value={field.value}
      conceptName={question.meta?.concept?.display}
      isInline={isInline}
    />
  ) : (
    !question.isHidden && (
      <>
        <div className={styles.boldedLabel}>
          <Layer>
            <TextInput
              {...field}
              id={question.id}
              labelText={
                question.isRequired ? (
                  <RequiredFieldLabel label={t(question.label)} />
                ) : (
                  <span>{t(question.label)}</span>
                )
              }
              name={question.id}
              value={field.value || ''}
              disabled={question.disabled}
              readOnly={Boolean(question.readonly)}
              invalid={errors.length > 0}
              invalidText={errors[0]?.message}
              warn={warnings.length > 0}
              warnText={warnings.length && warnings[0].message}
              maxLength={question.questionOptions.max || TextInput.maxLength}
            />
          </Layer>
        </div>
      </>
    )
  );
};

export default TextField;
