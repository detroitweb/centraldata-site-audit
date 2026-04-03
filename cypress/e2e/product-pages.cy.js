// Product/service pages — update slugs to match actual CentralData.com URLs
const PRODUCT_PAGES = [
  { name: 'cd-marketplace',          path: '/cd-marketplace/' },
  { name: 'cd-audit',         path: '/cd-audit/' },
  { name: 'cd-rental',   path: '/cd-rental/' },
];

describe('Product & Service Pages', () => {
  PRODUCT_PAGES.forEach(({ name, path }) => {
    describe(name, () => {
      beforeEach(() => {
        cy.visit(path);
        cy.waitForPageLoad();
      });

      it(`${name}: full-page snapshot`, () => {
        cy.snapshotPage(`product-${name}-full`);
      });

      it(`${name}: above-the-fold snapshot`, () => {
        cy.dismissOverlays();
        cy.compareSnapshot(`product-${name}-atf`);
      });
    });
  });
});
