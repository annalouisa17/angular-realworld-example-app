// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('loginToApplication', ()=> {

    const userCredentials = {
        "user": {
            "email": Cypress.env('username'),
            "password": Cypress.env('password')
        }
    }
    //browser authenticated before we open the home page
    // save the token into the cypress alias to be used in other places
    cy.request('POST', Cypress.env('apiUrl')+'api/users/login', userCredentials)
        .its('body').then( body => {
            const token = body.user.token
            cy.wrap(token).as('token')
            cy.visit('/', {
                onBeforeLoad(win) {
                    win.localStorage.setItem('jwtToken', token)
                }
            })

        })

    // cy.visit('/login')
    // cy.get('[placeholder="Email"]').type('anna@gmail.com')
    // cy.get('[placeholder="Password"]').type('testpass')
    // cy.get('form').submit()
})