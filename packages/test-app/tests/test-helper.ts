import Application from 'test-app/app';
import config from 'test-app/config/environment';
import { setApplication } from '@ember/test-helpers';
import { loadTests } from 'ember-qunit/test-loader';
import { start, setupEmberOnerrorValidation } from 'ember-qunit';

setApplication(Application.create(config.APP));
setupEmberOnerrorValidation();
loadTests();
start();
