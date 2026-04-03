describe('Main Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
    cy.dismissOverlays();
  });

  it('matches primary nav snapshot', () => {
    cy.get('nav, #site-navigation, .main-navigation, .primary-menu-container')
      .first()
      .compareSnapshot('nav-primary');
  });

  it('matches mobile nav (375px viewport)', () => {
    cy.viewport(375, 812);
    cy.visit('/');
    cy.waitForPageLoad();
    cy.dismissOverlays();
    cy.snapshotPage('nav-mobile-375');
  });

  it('matches tablet nav (768px viewport)', () => {
    cy.viewport(768, 1024);
    cy.visit('/');
    cy.waitForPageLoad();
    cy.dismissOverlays();
    cy.snapshotPage('nav-tablet-768');
  });
});
