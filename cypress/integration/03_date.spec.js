/// <reference types="Cypress" />

context('Date', () => {
  it('Displays the correct date info', () => {
    cy.clock(new Date(104907600000));
    cy.visit(Cypress.env('baseUrl'));

    cy.getByTestId('day').should('have.text', '29');
    cy.getByTestId('year').should('have.text', '1973');
    cy.getByTestId('month').should('have.text', 'Apr');
    cy.getByTestId('week-day').should('have.text', 'Sunday');
  });
});