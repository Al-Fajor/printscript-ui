// import {AUTH0_PASSWORD, AUTH0_USERNAME, BACKEND_URL, FRONTEND_URL} from "../../src/utils/constants";
import {CreateSnippet} from "../../src/utils/snippet";

describe('Home', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => {
      return false
    })
    cy.loginToAuth0(
        Cypress.env("AUTH0_USERNAME"),
        Cypress.env("AUTH0_PASSWORD")
    )
  })
  before(() => {
    process.env.FRONTEND_URL = Cypress.env("FRONTEND_URL");
    process.env.BACKEND_URL = Cypress.env("BACKEND_URL");
  })

  it('Renders home', () => {
    cy.visit(Cypress.env("FRONTEND_URL"))
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.MuiTypography-h6').should('have.text', 'Printscript');
    cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').should('be.visible');
    cy.get('.css-9jay18 > .MuiButton-root').should('be.visible');
    cy.get('.css-jie5ja').click();
    /* ==== End Cypress Studio ==== */
  })


  it('Can creat snippet find snippets by name', () => {
    cy.visit(Cypress.env("FRONTEND_URL"))
    const snippetData: CreateSnippet = {
      name: "Test name",
      content: "println(1);",
      language: "Printscript",
      extension: ".ps"
    }


    const backendUrl = Cypress.env("BACKEND_URL").replace(':80', "")
    const postUrl = backendUrl + "/snippet"
    // Wait for snippets to load
    const url = backendUrl + "/user/snippets?isOwner=true&isShared=false?name=?pageNumber=0?pageSize=10"

    cy.intercept('GET', url, (req) => {
      req.headers = {'Authorization': `Bearer ${localStorage.getItem("authAccessToken")}`}
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');



    cy.intercept('POST', postUrl, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(201);
      });
    }).as('postRequest');

    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.wait("@getSnippets")

    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get('#name').type(snippetData.name);
    cy.get('#demo-simple-select').click()
    cy.get('body').click();
    cy.get(`[data-testid="menu-option-${snippetData.language}/1.1"]`).click()

    cy.get('[data-testid="add-snippet-code-editor"]').click();
    cy.get('[data-testid="add-snippet-code-editor"]').type(snippetData.content);
    cy.get('[data-testid="SaveIcon"]').click();

    cy.wait('@postRequest').its('response.statusCode').should('eq', 201);
    cy.wait(8000)

      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').clear()
      cy.get('.MuiBox-root > .MuiInputBase-root > .MuiInputBase-input').type(snippetData.name + "{enter}")



      cy.contains(snippetData.name).should('exist');
    })


  // You need to have at least 1 snippet in your DB for this test to pass
  it('Renders the first snippets', () => {
    cy.visit(Cypress.env("FRONTEND_URL"))

    const backendUrl = Cypress.env('BACKEND_URL').replace(':80', '')
    const url = backendUrl + "/user/snippets?isOwner=true&isShared=false?name=?pageNumber=0?pageSize=10"
    cy.intercept('GET', url, (req) => {
      req.headers = {'Authorization': `Bearer ${localStorage.getItem("authAccessToken")}`}
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as('getSnippets');

    // cy.get('body').click(0, 0);
    cy.wait("@getSnippets")

    const first10Snippets = cy.get('[data-testid="snippet-row"]')

    first10Snippets.should('have.length.greaterThan', 0)

    first10Snippets.should('have.length.lte', 10)
  })
})
