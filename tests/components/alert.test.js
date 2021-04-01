import { expect, fixture, html, nextFrame, waitUntil } from '@open-wc/testing';
import sinon from 'sinon';

import '../../../dist/components/alert/alert.js';

describe('<sl-alert>', () => {
  const types = ['primary', 'success', 'info', 'warning', 'danger'];

  types.map(type => {
    it(`${type} alert should be accessible`, async () => {
      const el = await fixture(html` <sl-alert type=${type} open>I am an alert</sl-alert> `);
      const base = el.shadowRoot.querySelector('[part="base"]');
      await expect(base).to.be.accessible();
    });
  });

  it('should not be visible without open attribute', async () => {
    const el = await fixture(html` <sl-alert>I am an alert</sl-alert> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    expect(window.getComputedStyle(base).visibility).to.equal('hidden');
  });

  it('should be visible with open attribute', async () => {
    const el = await fixture(html` <sl-alert open>I am an alert</sl-alert> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    expect(window.getComputedStyle(base).visibility).to.equal('visible');
  });

  it('should be visible after calling show()', async () => {
    const showHandler = sinon.spy();
    const afterShowHandler = sinon.spy();
    const el = await fixture(html`
      <sl-alert @sl-show=${showHandler} @sl-after-show=${afterShowHandler}> I am an alert </sl-alert>
    `);
    const base = el.shadowRoot.querySelector('[part="base"]');

    // await DOM + style calc/painting
    await nextFrame();
    await nextFrame();

    el.show();
    await waitUntil(() => showHandler.calledOnce);
    await waitUntil(() => afterShowHandler.calledOnce);

    expect(el.open).to.equal(true);
  });

  it('should be hidden after calling hide()', async () => {
    const hideHandler = sinon.spy();
    const afterHideHandler = sinon.spy();
    const el = await fixture(html`
      <sl-alert open @sl-hide=${hideHandler} @sl-after-hide=${afterHideHandler}> I am an alert </sl-alert>
    `);
    const base = el.shadowRoot.querySelector('[part="base"]');

    // await DOM + style calc/painting
    await nextFrame();
    await nextFrame();

    el.hide();
    await waitUntil(() => hideHandler.calledOnce);
    await waitUntil(() => afterHideHandler.calledOnce);

    expect(el.open).to.equal(false);
  });
});
