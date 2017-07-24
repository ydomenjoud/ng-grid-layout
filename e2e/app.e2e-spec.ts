import { Grid2Page } from './app.po';

describe('grid2 App', () => {
  let page: Grid2Page;

  beforeEach(() => {
    page = new Grid2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
