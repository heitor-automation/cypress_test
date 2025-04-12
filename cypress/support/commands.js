import { faker } from '@faker-js/faker'

Cypress.Commands.add('ensureUserExists', (email, pass) => {
  return cy.api({
    method: 'GET',
    url: `https://serverest.dev/usuarios?email=${email}&administrador=true`,
    failOnStatusCode: false,
  }).then(response => {
    if (response.body.quantidade > 0) {
      return response
    } else {
      return cy.api({
        method: "POST",
        url: "https://serverest.dev/usuarios",
        body: {
          nome: faker.person.fullName(),
          email: email,
          password: pass,
          administrador: "true",
        },
        failOnStatusCode: false,
      }).then((response_post) => {
        expect(response_post.body.message).to.equal('Cadastro realizado com sucesso')
        return response_post
      })
    }
  })
})

Cypress.Commands.add('login', (user, pass) => {
  cy.get('[data-testid="email"]').type(user)
  cy.get('[data-testid="senha"]').type(pass)
  cy.get('button[type="submit"]').click()
})
