import setupFormEngineLibI18n from './setupI18n';
import { teardownBaseHandlerUtils } from './submission-handlers/base-handlers';
import { teardownTestOrderHandler } from './submission-handlers/testOrderHandler';

/**
 * Invoked on mounting the "FormEngine" component
 */
export function init() {
  // Setting up the i18n for the form engine library
  setupFormEngineLibI18n();
}

/**
 * Invoked on unmounting the "FormEngine" component
 */
export function teardown() {
  teardownBaseHandlerUtils();
  teardownTestOrderHandler();
}
