/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import jwt from 'jsonwebtoken'
Cypress.Commands.add('loginByAuth0Api', () => {
    cy.request({
        method: 'POST',
        url: `https://YOUR_AUTH0_DOMAIN/oauth/token`,
        body: {
            grant_type: 'password',
            username: Cypress.env('AUTH0_USERNAME'),
            password: Cypress.env('AUTH0_PASSWORD'),
            audience: process.env.VITE_AUTH0_AUDIENCE,
            scope: 'openid profile email',
            client_id: process.env.VITE_AUTH0_CLIENT_ID,
            client_secret: process.env.VITE_AUTH0_CLIENT_SECRET,
        },
    }).then(({ body }) => {
        const { access_token, expires_in, id_token } = body;

        const auth0State = {
            nonce: '',
            audience: process.env.VITE_AUTH0_AUDIENCE,
            client_id: process.env.VITE_AUTH0_CLIENT_ID,
            scope: 'openid profile email',
            token_type: 'Bearer',
            id_token,
            access_token,
            expires_in,
            decodedToken: {
                user: jwt.decode(id_token),
            },
        };

        window.localStorage.setItem(
            `@@auth0spajs@@::${auth0State.client_id}::${auth0State.audience}::${auth0State.scope}`,
            JSON.stringify(auth0State)
        );
    });
});