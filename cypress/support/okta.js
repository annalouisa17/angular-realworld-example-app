Cypress.Commands.add('loginWithOkta', () => {
    const optionsSessionToken = {
        method: 'POST',

        //this will be your own url
        //save this request to opensessiontoken
        url: 'https://----OKTA_AUTH_URL---/api/v1/authn',
        body: {
            username: Cypress.env('username'),
            password: Cypress.env('password'),
            options: {
                warnBeforePasswordExpired: 'true'
            }
        }
    };

    cy.request(optionsSessionToken).then(response => {
        //save the session token from response
        const sessionToken = response.body.sessionToken;
        //query string
        //all these parameters you get from your own 
        const qs = {
            client_id: '--client-id--',
            state: '--state-token--',
            nonce: '--nonce-token--',
            redirect_url: 'http://localhost:4200/implicit/callback',
            repsonse_mode: 'fragment',
            response_type: 'id_token token',
            scope: ['some', 'scome', 'of', 'your', 'application'],
            sessionToken
        };
        //call in authorization okta url and pass the query string
        //we want to intercept redirect
        cy.request({
            method: 'GET',
            url: 'https://--OKTA-AUTHORIZATION-URL--/oauth2/default/v1/authorize?',
            form: true,
            followRedirect: false,
            qs
        }).then(responseWithToken => {
            //need redirect url to get the access token
            const redirectUrl = responseWithToken.redirectedToUrl;

            const accessToken = redirectUrl
                .substring(redirectUrl.indexOf('access_token'))
                .split("=")[1]
                .split('&')[0];

            cy.wrap(accessToken).as('accessToken');

            cy.visit(redirectUrl).then(()=> {
                cy.visit('/');
            })
        })
    })
})