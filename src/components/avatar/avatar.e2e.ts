import { newE2EPage } from '@stencil/core/testing';

const testContent = `
<sl-avatar></sl-avatar>
`;

describe('alert', () => {
  it('should be visible on initial render', async () => {
    const page = await newE2EPage();
    await page.setContent(testContent);

    const base = await page.find('sl-avatar >>> [part=base]');

    expect(await base.isVisible()).toBe(true);
  });
});
