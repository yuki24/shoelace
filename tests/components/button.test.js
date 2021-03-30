import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';

import '../../../dist/components/button/button.js';

describe('sl-button', () => {
  it('should render as <button>', async () => {
    const el = await fixture(html` <sl-button>Click me</sl-button> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    expect(base).to.be.tagName('button');
  });

  it('should render as <a> when href is present', async () => {
    const el = await fixture(html` <sl-button href="about:blank">Click me</sl-button> `);
    const base = el.shadowRoot.querySelector('[part="base"]');
    expect(base).to.be.tagName('a');
  });

  it('should gain focus when calling focus()', async () => {
    const el = await fixture(html` <sl-button>Click me</sl-button> `);
    el.focus();
    expect(el.ownerDocument.activeElement).to.equal(el);
  });

  it('should lose focus when calling blur()', async () => {
    const el = await fixture(html` <sl-button>Click me</sl-button> `);
    el.focus();
    el.blur();
    expect(el.ownerDocument.activeElement).to.not.equal(el);
  });

  it('should emit sl-focus when gaining focus', async () => {
    const el = await fixture(html` <sl-button>Click me</sl-button> `);
    const handler = sinon.spy();
    el.addEventListener('sl-focus', handler);
    el.click();
    expect(handler).to.have.been.calledOnce;
  });

  it('should emit sl-blur when losing focus', async () => {
    const el = await fixture(html` <sl-button>Click me</sl-button> `);
    const handler = sinon.spy();
    el.addEventListener('sl-blur', handler);
    el.click();
    el.blur();
    expect(handler).to.have.been.calledOnce;
  });
});
