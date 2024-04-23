import React, { useEffect, useMemo, useState } from 'react';
import { FilterableMultiSelect, Layer, Tag } from '@carbon/react';
import classNames from 'classnames';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormContext } from '../../../form-context';
import { type FormFieldProps } from '../../../types';
import { ValueEmpty } from '../../value/value.component';
import { fieldRequiredErrCode, isEmpty } from '../../../validators/form-validator';
import { isInlineView } from '../../../utils/form-helper';
import { isTrue } from '../../../utils/boolean-utils';
import FieldValueView from '../../value/view/field-value-view.component';
import RequiredFieldLabel from '../../required-field-label/required-field-label.component';
import InlineDate from '../inline-date/inline-date.component';
import { ObsSubmissionHandler } from '../../../submission-handlers/base-handlers';

import styles from './multi-select.scss';

const MultiSelect: React.FC<FormFieldProps> = ({ question, onChange, handler, previousValue }) => {
  const { t } = useTranslation();
  const [field, meta] = useField(question.id);
  const { setFieldValue, encounterContext, layoutType, workspaceLayout, isFieldInitializationComplete } =
    React.useContext(FormContext);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [counter, setCounter] = useState(0);
  const isFieldRequiredError = useMemo(() => errors[0]?.errCode == fieldRequiredErrCode, [errors]);
  const [obsDate, setObsDate] = useState<Date>();

  useEffect(() => {
    if (question['submission']) {
      question['submission'].errors && setErrors(question['submission'].errors);
      question['submission'].warnings && setWarnings(question['submission'].warnings);
    }
  }, [question['submission']]);

  const selectOptions = question.questionOptions.answers
    .filter((answer) => !answer.isHidden)
    .map((answer, index) => ({
      id: `${question.id}-${answer.concept}`,
      concept: answer.concept,
      label: answer.label,
      key: index,
      disabled: answer.disable?.isDisabled,
    }));

  const initiallySelectedQuestionItems = useMemo(() => {
    if (isFieldInitializationComplete && field.value?.length && counter < 1) {
      setCounter(counter + 1);
      return selectOptions.filter((item) => field.value?.includes(item.concept));
    }
    return [];
  }, [isFieldInitializationComplete, field.value]);

  const handleSelectItemsChange = ({ selectedItems }) => {
    const value = selectedItems.map((selectedItem) => {
      return selectedItem.concept;
    });
    setFieldValue(question.id, value);
    onChange(question.id, value, setErrors, setWarnings);
    question.value =
      obsDate === undefined
        ? handler?.handleFieldSubmission(question, value, encounterContext)
        : handler?.handleFieldSubmission(question, value, {
            ...encounterContext,
            encounterDate: obsDate !== undefined ? obsDate : undefined,
          });
  };

  useEffect(() => {
    if (!isEmpty(previousValue) && Array.isArray(previousValue)) {
      const valuesToSet = previousValue.map((eachItem) => eachItem.value);
      setFieldValue(question.id, valuesToSet);
      onChange(question.id, valuesToSet, setErrors, setWarnings);
      question.value =
        obsDate === undefined
          ? handler?.handleFieldSubmission(question, valuesToSet, encounterContext)
          : handler?.handleFieldSubmission(question, valuesToSet, {
              ...encounterContext,
              encounterDate: obsDate !== undefined ? obsDate : undefined,
            });
    }
  }, [previousValue]);

  const isInline = useMemo(() => {
    if (['view', 'embedded-view'].includes(encounterContext.sessionMode) || isTrue(question.readonly)) {
      return isInlineView(question.inlineRendering, layoutType, workspaceLayout, encounterContext.sessionMode);
    }
    return false;
  }, [encounterContext.sessionMode, question.readonly, question.inlineRendering, layoutType, workspaceLayout]);

  return encounterContext.sessionMode == 'view' || encounterContext.sessionMode == 'embedded-view' ? (
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
      <>
        <div className={classNames(styles.boldedLabel, { [styles.errorLabel]: isFieldRequiredError })}>
          <Layer>
            <FilterableMultiSelect
              placeholder={t('search', 'Search') + '...'}
              onChange={handleSelectItemsChange}
              id={t(question.label)}
              items={selectOptions}
              initialSelectedItems={initiallySelectedQuestionItems}
              label={''}
              titleText={
                question.required ? <RequiredFieldLabel label={t(question.label)} /> : <span>{t(question.label)}</span>
              }
              key={counter}
              itemToString={(item) => (item ? item.label : ' ')}
              disabled={question.disabled}
              invalid={errors.length > 0}
              invalidText={errors[0]?.message}
              warn={warnings.length > 0}
              warnText={warnings[0]?.message}
              readOnly={question.readonly}
            />
          </Layer>
        </div>
        <div className={styles.selectionDisplay}>
          {field.value?.length ? (
            <div className={styles.tagContainer}>
              {handler?.getDisplayValue(question, field.value)?.map((displayValue, index) => (
                <Tag key={index} type="cool-gray">
                  {displayValue}
                </Tag>
              ))}
            </div>
          ) : (
            <ValueEmpty />
          )}
        </div>
        {question.questionOptions.showDate === 'true' ? (
          <div style={{ marginTop: '5px' }}>
            <InlineDate
              question={question}
              setObsDateTime={(value) => setObsDate(value)}
              onChange={() => {}}
              handler={ObsSubmissionHandler}
            />
          </div>
        ) : (
          ''
        )}
      </>
    )
  );
};

export default MultiSelect;
