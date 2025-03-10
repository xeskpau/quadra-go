describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the app title', () => {
    cy.get('h1').should('contain', 'QuadraGo');
  });

  // Add more test cases as we develop features
  it.skip('allows user to view sports centers', () => {
    cy.get('[data-testid="sports-center-list"]').should('exist');
  });

  it.skip('allows user to filter sports centers', () => {
    cy.get('[data-testid="sport-filter"]').should('exist');
    cy.get('[data-testid="sport-filter"]').select('Tennis');
    cy.get('[data-testid="sports-center-card"]').should('exist');
  });
}); 