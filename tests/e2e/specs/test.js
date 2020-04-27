// https://docs.cypress.io/api/introduction/api.html

const values = ['2', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3'];
const suits = { H: '❤️', D: '♦️', C: '♣️', S: '♠️' };

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
    cy.server();
    cy.route({
      method: 'GET',
      url: 'https://deckofcardsapi.com/api/deck/new/draw/?count=52',
      response: { deck_id: 'my_id' }
    });

    cy.visit('/');
    const rotationCard = getValidCard();
    cy.get('#rotation-card-input').type(rotationCard);

    let cards;

    cy.get('#add-card-input').as('addCardInput');
    cy.get('#add-card-button').as('addCardButton');

    const cardsQtd = random(10) + 1;
    cards = new Set();
    var i=0;
    do {
      const newCard = getValidCard();
      if (cards.has(newCard)) continue;
      cards.add(newCard);
      cy.get('@addCardInput').type(newCard);
      cy.get('@addCardButton').click();
      i++;
    } while (i<cardsQtd);

    const formatedCards = [rotationCard, ...cards].map((text) => text.slice(-2))
    cy.route({
      method: 'GET',
      url: 'https://deckofcardsapi.com/api/deck/my_id/pile/my_pile/add/?cards='+formatedCards.join(',').toUpperCase(),
      response: { deck_id: 'my_id' }
    }).as('createDeck');

    cy.route({
      method: 'GET',
      url: 'https://deckofcardsapi.com/api/deck/my_id/pile/my_pile/list',
      response: {
        piles: {
          my_pile: {
            cards: formatedCards.map((text) => ({
              code: text,
              suit: text[1],
              value: (text[0] === '0' ? '1' : '') + text[0]
            }))
          }
        }
      }
    }).as('getDeck');

    cy.get('form').submit();
    cy.wait('@getDeck');

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/deck/my_id');
    });
  })
})
