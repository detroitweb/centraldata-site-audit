// Key landing pages — update slugs to match actual CentralData.com URLs
const LANDING_PAGES = [
  { name: 'Infor CloudSuite Distribution',    path: '/infor-cloudsuite-distribution/' },
  { name: 'Analytics',  path: '/analytics/' },
  { name: 'Ecommerce',     path: '/ecommerce/' },
  { name: 'CD Marketplace',  path: '/cd-marketplace/'},
  { name: 'CD Ship',  path: '/cd-ship/'},
  { name: 'CD Rental',  path: '/cd-rental/'},
  { name: 'CD Report Pack',  path: '/cd-report-pack/'},
];

describe('Landing Pages', () => {
  LANDING_PAGES.forEach(({ name, path }) => {
    describe(name, () => {
      beforeEach(() => {
        cy.visit(path);
        cy.waitForPageLoad();
      });

      it(`${name}: full-page snapshot`, () => {
        cy.snapshotPage(`landing-${name}-full`);
      });

      it(`${name}: above-the-fold snapshot`, () => {
        cy.dismissOverlays();
        cy.compareSnapshot(`landing-${name}-atf`);
      });
    });
  });
});
