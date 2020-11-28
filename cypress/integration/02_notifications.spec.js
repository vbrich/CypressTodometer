/// <reference types="Cypress" />

context('Notifications', () => {
  it('Displays 30-minute reminder if there are pending todos', () => {

    // Stub the window.Notification object
    cy.visit(Cypress.env('baseUrl'), {
      onBeforeLoad(win) {
        cy.stub(win, 'Notification').as('Notification');
      },
    });

    // Add a pending todo item
    cy.getByTestId('add-todo-input').type('Learn Cypress!');
    cy.getByTestId('add-todo-button').click();

    // Set the clock to be exactly November 27th at 00:00:00
    cy.clock(new Date(1606453199 * 1000));

    cy.get('@Notification').should('not.have.been.called');

    cy.tick(1000);

    cy.get('@Notification').should('have.been.calledWith', 'todometer reminder!');

    // Restore time
    cy.clock().then((clock) => {
      clock.restore();
    });
  });

  it('Displays next day reset notification', () => {

    // Stub the window.Notification object
    cy.visit(Cypress.env('baseUrl'), {
      onBeforeLoad(win) {
        cy.stub(win, 'Notification').as('Notification');
      },
    });

    // Add 3 todos
    cy.getByTestId('add-todo-input').type('Learn Cypress!');
    cy.getByTestId('add-todo-button').click();
    cy.getByTestId('add-todo-input').type('Write tests');
    cy.getByTestId('add-todo-button').click();
    cy.getByTestId('add-todo-input').type('Be happy');
    cy.getByTestId('add-todo-button').click();

    // Make 1 paused and 1 completed
    cy.getByTestId('pause-button').eq(0).click();
    cy.getByTestId('complete-button').eq(0).click();

    // Each individual list should have the proper quantity
    cy.getByTestId('pending-list').children().should('have.length', 1);
    cy.getByTestId('paused-list').children().should('have.length', 1);
    cy.getByTestId('completed-list').children().should('have.length', 1);

    cy.clock(new Date());
    cy.get('@Notification').should('not.have.been.called');

    // 24 hours = 86400000 ms
    cy.tick(86400000);
    cy.get('@Notification').should('have.been.called');

    cy.getByTestId('pending-list').children().should('have.length', 2);
    cy.getByTestId('paused-list').children().should('have.length', 0);
    cy.getByTestId('completed-list').children().should('have.length', 0);
  });
});