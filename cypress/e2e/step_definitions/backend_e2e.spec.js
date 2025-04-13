/// <reference types="cypress" />

const { faker } = require("@faker-js/faker");
const { Given, When, Then } = require("cypress-cucumber-preprocessor/steps");

let datBody;
let apiResponse;
let userId;
let bearerToken;

function generateBody() {
  let body = {
    nome: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: faker.datatype.boolean().toString(),
  };

  return body;
}

Given("the user has the body to create a user {string} {string}", (field, type) => {
  datBody = generateBody();
  if (type === "negative") {
    delete datBody[field];
  }
});

Given("the user has the body to update a user {string}", (field) => {
  datBody = generateBody();

  if (field === "missing_informtion") {
    delete datBody["nome"];
  }

  if (field === "new_user" || field === "valid_user") {
    cy.ensureUserExists(faker.internet.email(), faker.internet.password()).then(
      (response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        userId =
          response.status === 200
            ? response.body.usuarios[0]._id
            : response.body._id;
      }
    );
  } else {
    userId = "123455";
  }
});

Given("the user has the id to delete a user {string}", (field) => {
  switch (field) {
    case "new_user":
      cy.ensureUserExists(faker.internet.email(), faker.internet.password()).then(
        (response) => {
          expect(response.status).to.be.oneOf([200, 201]);
          userId =
            response.status === 200
              ? response.body.usuarios[0]._id
              : response.body._id;
        }
      );
      break;
    case "user_with_cart":
      let email = faker.internet.email();
      let pass = faker.internet.password();
      cy.ensureUserExists(email, pass).then((response) => {
        expect(response.status).to.be.oneOf([200, 201]);
        userId =
          response.status === 200
            ? response.body.usuarios[0]._id
            : response.body._id;
        cy.tokenGenerate(email, pass).then((response_token) => {
          bearerToken = response_token;
          cy.createProduct(userId, bearerToken).then((response_product) => {
            let productId = response_product;
            cy.createUserCart(userId, bearerToken, productId);
          });
        });
      });
      break;
    default:
      userId = "123455";
      break;
  }
});

When("the user send the request to POSTcreatUser", () => {
  cy.api({
    method: "POST",
    url: `https://serverest.dev/usuarios`,
    body: datBody,
    failOnStatusCode: false,
  }).then((response) => {
    apiResponse = response;
  });
});

When("the user send the request to PUTupdatUser", () => {
  cy.api({
    method: "PUT",
    url: `https://serverest.dev/usuarios/${userId}`,
    body: datBody,
    failOnStatusCode: false,
  }).then((response) => {
    apiResponse = response;
  });
});

When("the user send the request to DELETEdeleteUser", () => {
  cy.api({
    method: "DELETE",
    url: `https://serverest.dev/usuarios/${userId}`,
    headers: {
      Authorization: bearerToken,
    },
    failOnStatusCode: false,
  }).then((response) => {
    apiResponse = response;
  });
});

Then("the user will validate the api response according to the scenario {string} {string}", (type, field) => {
  cy.wrap(apiResponse).should((aresp) => {
    expect(aresp.status).to.eq(type === "positive" ? 201 : 400);
    if (type === "positive") {
      expect(aresp.body.message).to.eq("Cadastro realizado com sucesso");
    } else {
      expect(aresp.body).to.have.property(field);
    }
  });
});

Then("the user will validate the api update response according to the scenario {string}", (type) => {
  cy.wrap(apiResponse).should((aresp) => {
    expect(aresp.status).to.eq(type === "positive" ? 200 : 400);
    if (type === "positive") {
      expect(aresp.body.message).to.eq("Registro alterado com sucesso");
    }
  });
});

Then("the user will validate the api delete response according to the scenario {string}", (type) => {
  cy.wrap(apiResponse).should((resp) => {
    expect(resp.status).to.eq(type === "positive" ? 200 : 400);
    if (type === "negative") {
      expect(resp.body.message).to.have.string("carrinho cadastrado");
    } else {
      expect(resp.body.message).to.be.oneOf([
        "Nenhum registro excluído",
        "Registro excluído com sucesso",
      ]);
    }
  });
});
