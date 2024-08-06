import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type FormSection } from '../../../types';
import { useFormProviderContext } from '../../../provider/form-provider';
import { FormFieldRenderer } from '../field/form-field-renderer.component';
import styles from './section-renderer.scss';
import classNames from 'classnames';
import { hasRendering } from '../../../utils/common-utils';

export const SectionRenderer = ({ section }: { section: FormSection }) => {
  const { formFieldAdapters } = useFormProviderContext();
  const sectionId = useMemo(() => section.label.replace(/\s/g, ''), [section.label]);
  return (
    <div className={styles.section}>
      {section.questions.map((question) =>
        formFieldAdapters[question.type] ? (
          <div key={`${sectionId}-${question.id}`} className={styles.sectionBody}>
            <FormFieldRenderer key={question.id} field={question} valueAdapter={formFieldAdapters[question.type]} />
          </div>
        ) : null,
      )}
    </div>
  );
};
