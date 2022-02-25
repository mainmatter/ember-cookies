import { module, test } from 'qunit';
import { setup, visit } from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | cookie-access', function (hooks) {
  setup(hooks);

  test('it renders a page...', async function (assert) {
    const value = Math.random().toString(36).substring(2);

    let { htmlDocument } = await visit('/', {
      headers: {
        cookie: `test-cookie=${value}`,
      },
    });

    assert.ok(htmlDocument.body.textContent.includes('now: '));
    assert.ok(htmlDocument.body.textContent.includes(`test-cookie: ${value}`));
  });
});
