describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
  });

  it('matches full-page snapshot', () => {
    cy.snapshotPage('homepage-full');
  });

  it('matches hero section snapshot', () => {
    cy.get('header, .hero, .wp-block-cover, #masthead').first().as('hero');
    cy.get('@hero').scrollIntoView();
    cy.get('@hero').compareSnapshot('homepage-hero');
  });

  it('matches footer snapshot', () => {
    cy.scrollTo('bottom');
    cy.get('footer, #colophon').first().as('footer');
    cy.get('@footer').scrollIntoView();
    cy.get('@footer').compareSnapshot('homepage-footer');
  });
});
