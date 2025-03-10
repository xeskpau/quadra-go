describe('Booking Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    // Assuming we have a test user
    cy.login('test@example.com', 'password123');
  });

  it('should allow user to book a sports center', () => {
    // Find and click on a sports center
    cy.get('[data-testid="sports-center-card"]').first().click();

    // Select a date
    cy.get('[data-testid="date-picker"]').type('2024-03-15');

    // Select a time slot
    cy.get('[data-testid="time-slot-select"]').select('09:00 - 10:00');

    // Click book button
    cy.get('[data-testid="book-button"]').click();

    // Verify booking confirmation
    cy.get('[data-testid="booking-confirmation"]').should('be.visible');
    cy.contains('Booking confirmed').should('be.visible');
  });

  it('should show error for unavailable slot', () => {
    cy.get('[data-testid="sports-center-card"]').first().click();
    cy.get('[data-testid="date-picker"]').type('2024-03-15');
    cy.get('[data-testid="time-slot-select"]').select('11:00 - 12:00');
    cy.get('[data-testid="book-button"]').click();

    cy.contains('This slot is no longer available').should('be.visible');
  });

  it('should filter sports centers by sport', () => {
    cy.get('[data-testid="sport-filter"]').select('Tennis');
    cy.get('[data-testid="sports-center-card"]').should('have.length.gt', 0);
    cy.contains('Tennis').should('be.visible');
  });

  it('should show sports centers on map', () => {
    cy.get('[data-testid="map-view-button"]').click();
    cy.get('[data-testid="map-container"]').should('be.visible');
    cy.get('[data-testid="map-marker"]').should('have.length.gt', 0);
  });
}); 