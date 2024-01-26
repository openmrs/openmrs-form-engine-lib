import React, { useEffect, useState } from 'react';
import { useField } from 'formik';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastNotification, Grid, Column, Row } from '@carbon/react';
import { getRegisteredFieldSubmissionHandler } from '../../registry/registry';
import { OHRIUnspecified } from '../inputs/unspecified/ohri-unspecified.component';
import { OHRIFormField, OHRIFormFieldProps, SubmissionHandler } from '../../api/types';
import styles from './ohri-form-section.scss';
import { getFieldControlWithFallback, isUnspecifiedSupported } from './helpers';
import { OHRITooltip } from '../inputs/tooltip/ohri-tooltip';
import { subtle } from 'crypto';

interface FieldComponentMap {
  fieldComponent: React.ComponentType<OHRIFormFieldProps>;
  fieldDescriptor: OHRIFormField;
  handler: SubmissionHandler;
}

const OHRIFormSection = ({ fields, onFieldChange }) => {
  const [fieldComponentMapEntries, setFieldComponentMapEntries] = useState<FieldComponentMap[]>([]);

  useEffect(() => {
    Promise.all(
      fields.map(async (fieldDescriptor) => {
        const fieldComponent = await getFieldControlWithFallback(fieldDescriptor);
        const handler = await getRegisteredFieldSubmissionHandler(fieldDescriptor.type);
        return { fieldDescriptor, fieldComponent, handler };
      }),
    ).then((results) => {
      setFieldComponentMapEntries(results);
    });
  }, [fields]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
      <Grid>
        {/* <div className={styles.sectionContainer}> */}
        <Column lg={8} md={8} sm={12} xs={12}>
          {fieldComponentMapEntries
            .filter((entry) => entry?.fieldComponent)
            .map((entry, index) => {
              const { fieldComponent: FieldComponent, fieldDescriptor, handler } = entry;
              if (FieldComponent) {
                const qnFragment = (
                  <FieldComponent
                    question={fieldDescriptor}
                    onChange={onFieldChange}
                    key={index}
                    handler={handler}
                    useField={useField}
                  />
                );

                return (
                  // <div key={index} className={styles.parent}>
                  <Row key={index}>
                    {qnFragment}
                    <div
                      className={
                        isUnspecifiedSupported(fieldDescriptor) ? styles.tooltipWithUnspecified : styles.tooltip
                      }>
                      {isUnspecifiedSupported(fieldDescriptor) &&
                        fieldDescriptor.questionOptions.rendering != 'group' && (
                          <OHRIUnspecified question={fieldDescriptor} onChange={onFieldChange} handler={handler} />
                        )}
                      {fieldDescriptor.questionInfo && <OHRITooltip field={fieldDescriptor} />}
                    </div>
                  </Row>
                );
              }
            })}
        </Column>
      </Grid>
    </ErrorBoundary>
  );
};

function ErrorFallback({ error }) {
  // TODOS:
  // 1. Handle internationalization
  // 2. Show a more descriptive error message about the field
  return (
    <ToastNotification
      ariaLabel="closes notification"
      caption=""
      hideCloseButton
      lowContrast
      onClose={function noRefCheck() {}}
      onCloseButtonClick={function noRefCheck() {}}
      statusIconDescription="notification"
      subtitle={`Message: ${error.message}`}
      title="Error rendering field"
    />
  );
}

export default OHRIFormSection;
