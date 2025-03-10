describe('App', () => {
  beforeEach(() => {
    // Set CI environment variable to true
    Cypress.env('CI', true);
    
    // Visit the app
    cy.visit('/');
  });

  it('displays the app title and tagline', () => {
    cy.get('header h1').should('contain', 'QuadraGo');
    cy.get('header p').should('contain', 'Connect with sports centers near you');
  });

  it('displays the hero section with CTA button', () => {
    cy.get('h2').should('contain', 'Find and Book Sports Facilities with Ease');
    cy.get('button').contains('Get Started').should('be.visible');
  });

  it('displays three feature cards', () => {
    cy.contains('h3', 'Find Nearby Facilities').should('be.visible');
    cy.contains('h3', 'Easy Booking').should('be.visible');
    cy.contains('h3', 'Find Players').should('be.visible');
  });

  it('displays the footer with copyright information', () => {
    const currentYear = new Date().getFullYear();
    cy.get('footer').should('contain', `© ${currentYear} QuadraGo. All rights reserved.`);
  });

  // These tests are skipped as they are for future features
  it.skip('allows user to view sports centers', () => {
    cy.get('[data-testid="sports-center-list"]').should('exist');
  });

  it.skip('allows user to filter sports centers', () => {
    cy.get('[data-testid="sport-filter"]').should('exist');
    cy.get('[data-testid="sport-filter"]').select('Tennis');
    cy.get('[data-testid="sports-center-card"]').should('exist');
  });
}); 