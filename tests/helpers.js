import { fixture, html, nextFrame } from '@open-wc/testing';

// We wrap `fixture()` and wait a couple cycles until the fixture has been painted. This prevents us from having to
// include multiple calls to `nextFrame()` in every test.
export async function createFixture(markup) {
  return new Promise(async resolve => {
    const el = fixture(html`${markup}`);

    // await DOM to page
    await nextFrame();

    // await style calc + painting
    await nextFrame();

    resolve(el);
  });
}
