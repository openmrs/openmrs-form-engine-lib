import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { FormGroup, ContentSwitcher as CdsContentSwitcher, Switch } from '@carbon/react';
import { useField } from 'formik';
import { isInlineView } from '../../../utils/form-helper';
import { isEmpty } from '../../../validators/form-validator';
import { isTrue } from '../../../utils/boolean-utils';
import { FormContext } from '../../../form-context';
import { type FormFieldProps } from '../../../types';
import FieldValueView from '../../value/view/field-value-view.component';
import InlineDate from '../inline-date/inline-date.component';
import { getQuestionValue } from '../../../utils/common-utils';
import { useFieldValidationResults } from '../../../hooks/useFieldValidationResults';

import styles from './content-switcher.scss';

const ContentSwitcher: React.FC<FormFieldProps> = ({ question, onChange, handler, previousValue }) => {
  const { t } = useTranslation();
  const [field] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout } = React.useContext(FormContext);
  const { errors, setErrors } = useFieldValidationResults(question);
  const [obsDate, setObsDate] = useState<Date>();


  useEffect(() => {
    if (!isEmpty(previousValue)) {
      const { value } = previousValue;
      setFieldValue(question.id, value);
      onChange(question.id, value, setErrors, null);
      question.value = getQuestionValue({ obsDate, question, value, handler, encounterContext });
    }
  }, [previousValue]);

  const handleChange = (value) => {
    setFieldValue(question.id, value?.name);
    onChange(question.id, value?.name, setErrors, null);
    question.value = getQuestionValue({ obsDate, question, value, handler, encounterContext });
  };

  const selectedIndex = useMemo(
    () => question.questionOptions.answers.findIndex((option) => option.concept == field.value),
    [field.value, question.questionOptions.answers],
  );

  const isInline = useMemo(() => {
    if (['view', 'embedded-view'].includes(encounterContext.sessionMode) || isTrue(question.readonly)) {
      return isInlineView(question.inlineRendering, layoutType, workspaceLayout, encounterContext.sessionMode);
    }
    return false;
  }, [encounterContext.sessionMode, question.readonly, question.inlineRendering, layoutType, workspaceLayout]);

  return encounterContext.sessionMode == 'view' ||
    encounterContext.sessionMode == 'embedded-view' ||
    isTrue(question.readonly) ? (
    <div className={styles.formField}>
      <FieldValueView
        label={t(question.label)}
        value={field.value ? handler?.getDisplayValue(question, field.value) : field.value}
        conceptName={question.meta?.concept?.display}
        isInline={isInline}
      />
    </div>
  ) : (
    !question.isHidden && (
      <FormGroup
        legendText={t(question.label)}
        className={classNames({
          [styles.errorLegend]: errors.length > 0,
          [styles.boldedLegend]: errors.length === 0,
        })}>
        <CdsContentSwitcher
          onChange={handleChange}
          selectedIndex={selectedIndex}
          className={styles.selectedOption}
          size="md">
          {question.questionOptions.answers.map((option, index) => (
            <Switch
              name={option.concept || option.value}
              text={option.label}
              key={index}
              disabled={question.disabled}
            />
          ))}
        </CdsContentSwitcher>

        {question.questionOptions.showDate === 'true' ? (
          <div style={{ marginTop: '5px' }}>
            <InlineDate
              question={question}
              setObsDateTime={(value) => setObsDate(value)}
            />
          </div>
        ) : (
          ''
        )}
      </FormGroup>
    )
  );
};

export default ContentSwitcher;
