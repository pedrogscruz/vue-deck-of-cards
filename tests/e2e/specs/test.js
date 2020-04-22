// https://docs.cypress.io/api/introduction/api.html

import { values, suits } from '../../../src/utils/card';

const COMMAND_DELAY = 500;


for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal);
      }, COMMAND_DELAY);
    });
  });
} 

const suitsArray = Object.entries(suits);
const random = (range) => Math.floor(Math.random() * range);
const getValidCard = () => (
  values[random(values.length)] + suitsArray[random(suitsArray.length)][0]
);

describe('Deck of Cards App', () => {
  it('create cards deck', () => {
    cy.visit('/');
    cy.get('#rotation-card-input').type(getValidCard());

    let cards;
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/deck/new');
    });

    cy.get('#add-card-input').as('addCardInput');
    cy.get('#add-card-button').as('addCardButton');

    const cardsQtd = random(10) + 1;
    cards = new Set();
    for (var i=0; i<cardsQtd; i++) {
      const newCard = getValidCard();
      if (cards.has(newCard)) continue;
      cards.add(newCard);
      cy.get('@addCardInput').type(newCard);
      cy.get('@addCardButton').click();
    }
    cy.get('form').submit();
  })
})
