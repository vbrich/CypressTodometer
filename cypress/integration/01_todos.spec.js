/// <reference types="Cypress" />

context('Todos', () => {
  it('Adds Todos', () => {
    cy.visit(Cypress.env('baseUrl'));
    cy.clearLocalStorage();

    cy.getByTestId('todo').should('have.length', 0);

    // Add 3 todos
    cy.getByTestId('add-todo-input').type('Learn Cypress!');
    cy.getByTestId('add-todo-button').click();
    cy.getByTestId('add-todo-input').type('Write tests');
    cy.getByTestId('add-todo-button').click();
    cy.getByTestId('add-todo-input').type('Be happy');
    cy.getByTestId('add-todo-button').click();

    // Should have 3 todos
    cy.getByTestId('todo').should('have.length', 3);

    // First todo should say "Learn Cypress!"
    cy.getByTestId('todo').children().first().should('have.text', 'Learn Cypress!');

    // Each individual list should have the proper quantity
    cy.getByTestId('pending-list').children().should('have.length', 3);
    cy.getByTestId('paused-list').children().should('have.length', 0);
    cy.getByTestId('completed-list').children().should('have.length', 0);
  });

  it('Does not allow users to add empty todos', () => {
    // Should have 3 todos
    cy.getByTestId('todo').should('have.length', 3);
    cy.getByTestId('add-todo-button').click();

    // Should still have 3 todos
    cy.getByTestId('todo').should('have.length', 3);
  });

  it('Pauses Todos', () => {
    // The Do Later accordion should not exist because none are paused yet
    cy.contains('Do Later').should('not.exist');

    // Get the second pause button in the todo list (aka Todo #2's pause button) and click it
    cy.getByTestId('pause-button').eq(1).click();

    // Now this should be visible
    cy.contains('Do Later').should('exist');

    // Each individual list should have the proper quantity
    cy.getByTestId('pending-list').children().should('have.length', 2);
    cy.getByTestId('paused-list').children().should('have.length', 1);
    cy.getByTestId('completed-list').children().should('have.length', 0);
  });
  it('Resumes Todos', () => {
    // If we don't click it, the resume button will not be visible
    cy.contains('Do Later').should('exist').click();

    // Click resume on the paused todo
    cy.getByTestId('resume-button').click();

    // The accordion should have disappeared
    cy.contains('Do Later').should('not.exist');

    // Each individual list should have the proper quantity
    cy.getByTestId('pending-list').children().should('have.length', 3);
    cy.getByTestId('paused-list').children().should('have.length', 0);
    cy.getByTestId('completed-list').children().should('have.length', 0);
  });

  it('Completes Todos', () => {
    // The Completed accordion should not exist because none are completed yet
    cy.contains('Completed').should('not.exist');

    // Get the 3rd item's complete button
    cy.getByTestId('complete-button').eq(2).click();

    // The accordion should exist now
    cy.contains('Completed').should('exist');

    // Each individual list should have the proper quantity
    cy.getByTestId('pending-list').children().should('have.length', 2);
    cy.getByTestId('paused-list').children().should('have.length', 0);
    cy.getByTestId('completed-list').children().should('have.length', 1);
  });

  it('Deletes todos', () => {
    cy.contains('Be happy').should('exist');
    cy.getByTestId('delete-button').eq(2).click();
    cy.contains('Be happy').should('not.exist');

    // Each individual list should have the proper quantity
    cy.getByTestId('pending-list').children().should('have.length', 2);
    cy.getByTestId('paused-list').children().should('have.length', 0);
    cy.getByTestId('completed-list').children().should('have.length', 0);
  });

  it('Allows users to reset the todo state manually', () => {
    // Rules:
    // 1. Paused items will move to Pending
    // 2. Completed items will be removed
    // 3. Pending items will remain unchanged

    // The reset button should not be visible unless we have at least 1 completed todo
    cy.getByTestId('reset-button').should('not.exist');

    // First let's add a new todo so that we can have a total of 3
    cy.getByTestId('add-todo-input').type('Test Reset Command');
    cy.getByTestId('add-todo-button').click();

    // They should all be pending
    cy.getByTestId('pending-list').children().should('have.length', 3);
    cy.getByTestId('paused-list').children().should('have.length', 0);
    cy.getByTestId('completed-list').children().should('have.length', 0);

    cy.getByTestId('complete-button').eq(1).click();
    cy.getByTestId('pause-button').eq(1).click();

    // They should all be in separate lists now
    cy.getByTestId('pending-list').children().should('have.length', 1);
    cy.getByTestId('paused-list').children().should('have.length', 1);
    cy.getByTestId('completed-list').children().should('have.length', 1);

    // The reset button should now be visible and we should click it
    cy.getByTestId('reset-button').should('exist').click();

    // The completed item should be gone and the remaining two should be pending
    cy.getByTestId('pending-list').children().should('have.length', 2);
    cy.getByTestId('paused-list').children().should('have.length', 0);
    cy.getByTestId('completed-list').children().should('have.length', 0);
  });
});