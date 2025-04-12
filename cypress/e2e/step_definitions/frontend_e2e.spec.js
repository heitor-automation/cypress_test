/// <reference types="cypress" />

const { faker } = require("@faker-js/faker")
const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps")
let user_name
let product_name
const credetials = {
  email: 'e2eTest@email.com',
  pass: 'open'
}

Given("the user access the home page of server {string} {string} {string}", (email, pass, type) => {
  if (type === "positive") {
    cy.ensureUserExists(email, pass).then( response => {
      user_name = response.body.usuarios[0].nome
    })
  }
  cy.visit("https://front.serverest.dev/login")
})


Given('the user access the home page of server with right credentials', () => {
	cy.ensureUserExists(credetials.email, credetials.pass).then( () => {
    cy.visit("https://front.serverest.dev/login")
    cy.login(credetials.email, credetials.pass)
  })
})


When(
  "the user try to login with credentials {string} {string}",
  (email, pass) => {
    cy.login(email, pass)
  }
)

Then("the user will validate according to the scenario {string}", (type) => {
  if (type === "positive") {
    {
      cy.contains("h1", `Bem Vindo ${user_name}`).should("be.visible")
    }
  } else {
    cy.get(".alert")
      .should("be.visible")
      .and("contain", "Email e/ou senha inválidos")
  }
})


When('the user click in subscribe new {string}', (type) => {
	cy.get(`[data-testid^="${type}"]`).click()
})

When('the user send the form {string} {string}', (type_wrong, type_right) => {
  cy.get(`[data-testid^="${type_wrong}"], [data-testid^="${type_right}"]`).click()
})

When('the user fill the new credentials {string} {string} {string}', (email, pass, name) => {
  cy.get('[data-testid="nome"]').type(name)
  email === 'validEmail' ? cy.get('[data-testid="email"]').type(faker.internet.email()) : cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="password"]').type(pass)
  cy.get('[data-testid="checkbox"]').click()
  
})

Then('the user will validate that the user is {string}', (status) => {
  if (status === "invalid") {
    cy.get("span").should("contain", "Email deve ser um email válido")
  } else {
    cy.get("h1").should("contain", "Lista dos usuários")
    cy.get('table.table-striped tbody tr td').should('contain', user_name)
  }
})

When('the user fill the new product information {string}', (valid) => {
  product_name = faker.commerce.productName()
  if (valid === 'valid_product'){
    cy.get('[data-testid="nome"]').type(product_name) 
    cy.get('[data-testid="preco"]').type(faker.number.int({ min: 1, max: 1000 }))
    cy.get('[data-testid="descricao"]').type(faker.commerce.productDescription())
    cy.get('[data-testid="quantity"]').type(faker.number.int({ min: 1, max: 100 }))
  }
})

Then('the user will validate that the product is {string}', (valid) => {
	if(valid === 'valid_product'){
    cy.get('table.table-striped tbody tr td').should('contain', product_name)
  }
  else {
    cy.get('span').should('contain', 'Nome é obrigatório')
    cy.get('span').should('contain', 'Preco é obrigatório')
    cy.get('span').should('contain', 'Descricao é obrigatório')
    cy.get('span').should('contain', 'Quantidade é obrigatório')
  }
})

