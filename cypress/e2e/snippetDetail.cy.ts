const BACKEND_URL = Cypress.env('BACKEND_URL').replace(':80', '')
describe('Add snippet tests', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', () => {
      return false
    })

    cy.loginToAuth0(
        Cypress.env("AUTH0_USERNAME"),
        Cypress.env("AUTH0_PASSWORD")
    )

    cy.intercept('GET', BACKEND_URL+"/user/snippets?isOwner=true&isShared=false?name=?pageNumber=0?pageSize=10")
        .as("getSnippets")

    cy.visit("/")

    cy.get('.css-9jay18 > .MuiButton-root').click();
    cy.wait("@getSnippets")

    cy.get('body').click(0, 0)
    cy.wait(2000)
    cy.get('.MuiTableBody-root > :nth-child(1) > :nth-child(1)').click();
  })

  it('Can share a snippet ', () => {
    cy.get('[aria-label="Share"]').click();
    cy.get('.css-1h51icj-MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input').click();
    cy.get('.css-gdh49b-MuiAutocomplete-listbox .MuiAutocomplete-option').first().click();
    cy.get('.css-1yuhvjn > .MuiBox-root > .MuiButton-contained').click();
  })

  // There's no button in the UI that shows that a Snippet can be run
  // it('Can run snippets', function() {
  //   cy.get('[data-testid="PlayArrowIcon"]').click();
  //   cy.get('.css-1hpabnv > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').should("have.length.greaterThan",0);
  // });

  it('Can format snippets', function() {
    cy.get('[data-testid="ReadMoreIcon"] > path').click();
  });

  it('Can save snippets', function() {
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').click();
    cy.get('.css-10egq61 > .MuiBox-root > div > .npm__react-simple-code-editor__textarea').type("Some new line");
    cy.get('[data-testid="SaveIcon"] > path').click();
  });

  it('Can delete snippets', function() {
    cy.get('[data-testid="DeleteIcon"] > path').click();
  });
})