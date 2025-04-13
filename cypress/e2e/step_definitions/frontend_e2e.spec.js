/// <reference types="cypress" />

const { faker } = require("@faker-js/faker")
const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps")
const data = require("../../fixtures/data.json")

let user_name
let product_name

Given("the user access the home page of server {string} {string} {string}", (email, pass, type) => {
  if (type === "positive") {
    cy.ensureUserExists(email, pass).then((response) => {
      user_name = response.body.usuarios[0].nome
    })
  }
  cy.visit(Cypress.env("baseUrlFront"))
})

Given("the user access the home page of server with right credentials", () => {
  cy.ensureUserExists(data.credentials.email, data.credentials.pass).then(() => {
    cy.visit(Cypress.env("baseUrlFront"))
    cy.login(data.credentials.email, data.credentials.pass)
  })
})

When("the user try to login with credentials {string} {string}", (email, pass) => {
  cy.login(email, pass)
})

Then("the user will validate according to the scenario {string}", (type) => {
  if (type === "positive") {
    cy.contains("h1", `Bem Vindo ${user_name}`).should("be.visible")
  } else {
    cy.get(".alert")
      .should("be.visible")
      .and("contain", data.validationMessages.login.invalidCredentials)
  }
})

When("the user click in subscribe new {string}", (type) => {
  cy.get(`[data-testid^="${type}"]`).click()
})

When("the user send the form {string} {string}", (type_wrong, type_right) => {
  cy.get(`[data-testid^="${type_wrong}"], [data-testid^="${type_right}"]`).click()
})

When("the user fill the new credentials {string} {string} {string}", (email, pass, name) => {
  cy.get('[data-testid="nome"]').type(name)
  email === "validEmail"
    ? cy.get('[data-testid="email"]').type(faker.internet.email())
    : cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="password"]').type(pass)
  cy.get('[data-testid="checkbox"]').click()
})

Then("the user will validate that the user is {string}", (status) => {
  if (status === "invalid") {
    cy.get("span").should("contain", data.validationMessages.user.emailInvalid)
  } else {
    cy.get("h1").should("contain", "Lista dos usuários")
    cy.get("table.table-striped tbody tr td").should("contain", user_name)
  }
})

When("the user fill the new product information {string}", (valid) => {
  product_name = faker.commerce.productName()
  if (valid === "valid_product") {
    cy.get('[data-testid="nome"]').type(product_name)
    cy.get('[data-testid="preco"]').type(faker.number.int({ min: 1, max: 1000 }))
    cy.get('[data-testid="descricao"]').type(faker.commerce.productDescription())
    cy.get('[data-testid="quantity"]').type(faker.number.int({ min: 1, max: 100 }))
  }
})

Then("the user will validate that the product is {string}", (valid) => {
  if (valid === "valid_product") {
    cy.get("table.table-striped tbody tr td").should("contain", product_name)
  } else {
    cy.get("span").should("contain", data.validationMessages.product.nameRequired)
    cy.get("span").should("contain", data.validationMessages.product.priceRequired)
    cy.get("span").should("contain", data.validationMessages.product.descriptionRequired)
    cy.get("span").should("contain", data.validationMessages.product.quantityRequired)
  }
})

