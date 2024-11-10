// import {BACKEND_URL} from "../../src/utils/constants";

describe('Add snippet tests', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    console.log('Logging in to AUTH0')
    cy.loginToAuth0(
        Cypress.env('AUTH0_USERNAME'),
        Cypress.env('AUTH0_PASSWORD')
    )
  })
  it('Can add snippets manually', () => {
    cy.visit("/")
    const backendUrl = Cypress.env("BACKEND_URL")
    const url = backendUrl.replace(':80', "") + "/snippet"
    console.log("Backend url: ", url)
    cy.intercept('POST', url, (req) => {
      req.reply((res) => {
        // expect(res.body).to.include.keys("id","name","content","language")
        expect(res.statusCode).to.eq(201);
      });
    }).as('postRequest');

    cy.wait(10000) // Need to render page and languages

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type('Some snippet name');
    cy.get('#demo-simple-select').click()
    cy.get('body').click();
    cy.get('[data-testid="menu-option-Printscript"]').click()

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(`const snippet: string = "some snippet"; \n println(snippet);`);
    cy.get('[data-testid="SaveIcon"]').click();
    cy.wait('@postRequest').its('response.statusCode').should('eq', 201); // Should create snippet
  })

  it('Can add snippets via file', () => {
    cy.visit("/")
    cy.intercept('POST', Cypress.env("BACKEND_URL").replace(':80','')+"/snippet", (req) => {
      req.headers = {'Authorization': `Bearer ${localStorage.getItem('authAccessToken')}`}
      req.reply((res) => {
        expect(res.statusCode).to.eq(201);
      });
    }).as('postRequest');

    cy.wait(10000) // Need to render page and languages

    /* ==== Generated with Cypress Studio ==== */
    const backendUrl = Cypress.env("BACKEND_URL").replace(':80', "")
    // Wait for snippets to load
    const url = backendUrl + "/user/snippets?isOwner=true&isShared=false?name=?pageNumber=0?pageSize=10"


    cy.intercept('GET', url, (req) => {
      req.headers = {'Authorization': `Bearer ${localStorage.getItem("authAccessToken")}`}
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');
    cy.get('.css-9jay18 > .MuiButton-root').click();

    cy.wait("@getSnippets")
    cy.get('[data-testid="upload-file-input"').selectFile("cypress/fixtures/example_ps.ps", {force: true})

    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 201);
  })
})
