// Dismiss cookie banners or popups before taking a snapshot
Cypress.Commands.add('dismissOverlays', () => {
  cy.get('body').then(($body) => {
    const selectors = [
      '.cookie-accept',
      '#cookie-accept',
      '.accept-cookies',
      '[data-action="accept-cookies"]',
      '.wp-consent-accept',
    ];
    selectors.forEach((sel) => {
      if ($body.find(sel).length > 0) {
        cy.get(sel).first().click({ force: true });
      }
    });
  });
});

// Wait for page to be fully loaded (fonts, images)
Cypress.Commands.add('waitForPageLoad', () => {
  cy.document().its('readyState').should('eq', 'complete');
  cy.wait(500);
});

// Snapshot a page with standard setup
Cypress.Commands.add('snapshotPage', (name) => {
  cy.dismissOverlays();
  cy.waitForPageLoad();
  cy.compareSnapshot(name);
});
