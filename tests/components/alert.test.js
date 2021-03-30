import { expect, fixture, html, oneEvent, waitUntil, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';

import '../../../dist/components/alert/alert.js';

describe('sl-button', () => {
  it('should not be visible without open attribute', async () => {
    const el = await fixture(html` <sl-alert>I am an alert</sl-alert> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    const styles = window.getComputedStyle(base).visibility;
    expect(styles).to.equal('hidden');
  });

  it('should be visible with open attribute', async () => {
    const el = await fixture(html` <sl-alert open>I am an alert</sl-alert> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    const styles = window.getComputedStyle(base).visibility;
    expect(styles).to.equal('visible');
  });

  it('should emit sl-show on show', async () => {
    const el = await fixture(html` <sl-alert>I am an alert</sl-alert> `);
    const handler = sinon.spy();
    el.addEventListener('sl-show', handler);
    setTimeout(() => el.show());
    await oneEvent(el, 'sl-show');
    expect(handler).to.have.been.calledOnce;
  });

  it('should emit sl-hide on hide', async () => {
    const el = await fixture(html` <sl-alert open>I am an alert</sl-alert> `);
    const handler = sinon.spy();
    el.addEventListener('sl-hide', handler);
    setTimeout(() => el.hide());
    await oneEvent(el, 'sl-hide');
    expect(handler).to.have.been.calledOnce;
  });

  it('should emit sl-after-show after show', async () => {
    const el = await fixture(html` <sl-alert>I am an alert</sl-alert> `);
    const handler = sinon.spy();
    el.addEventListener('sl-after-show', handler);
    setTimeout(() => el.show());
    // await aTimeout(300);
    await oneEvent(el, 'sl-after-show');
    expect(handler).to.have.been.calledOnce;
  });

  it('should emit sl-after-hide after hide', async () => {
    const el = await fixture(html` <sl-alert open>I am an alert</sl-alert> `);
    const handler = sinon.spy();
    el.addEventListener('sl-after-hide', handler);
    await el.updateComplete;
    // await oneEvent(el, 'sl-after-show');
    // await aTimeout(50);
    setTimeout(() => el.hide());
    // await aTimeout(300);
    await oneEvent(el, 'sl-after-hide');
    expect(handler).to.have.been.calledOnce;
  });

  it('should be visible after show() is called', async () => {
    const el = await fixture(html` <sl-alert>I am an alert</sl-alert> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    el.show();
    await aTimeout(300);
    expect(window.getComputedStyle(base).opacity).to.equal('1');
  });

  it('should not be visible after hide() is called', async () => {
    const el = await fixture(html` <sl-alert open>I am an alert</sl-alert> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    el.hide();
    await aTimeout(300);
    expect(window.getComputedStyle(base).opacity).to.equal('0');
  });
});
