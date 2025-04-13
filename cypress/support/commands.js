import { faker } from '@faker-js/faker';

Cypress.Commands.add('ensureUserExists', (email, pass) => {
  return cy.api({
    method: 'GET',
    url: `https://serverest.dev/usuarios?email=${email}&administrador=true`,
    failOnStatusCode: false,
  }).then(response => {
    if (response.body.quantidade > 0) {
      return response;
    } else {
      return cy.api({
        method: "POST",
        url: `https://serverest.dev/usuarios`,
        body: {
          nome: faker.person.fullName(),
          email: email,
          password: pass,
          administrador: "true",
        },
        failOnStatusCode: false,
      }).then((response_post) => {
        expect(response_post.body.message).to.equal('Cadastro realizado com sucesso');
        return response_post;
      });
    }
  });
});

Cypress.Commands.add('login', (user, pass) => {
  cy.get('[data-testid="email"]').type(user);
  cy.get('[data-testid="senha"]').type(pass);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('tokenGenerate', (email, pass) => {
  cy.api({
    method: 'POST',
    url: `https://serverest.dev/login`,
    body: {
      email: email,
      password: pass,
    },
    failOnStatusCode: false,
  }).then(response => {
    return response.body.authorization;
  });
});

Cypress.Commands.add('createProduct', (userId, bearerToken) => {
  cy.api({
    method: 'POST',
    url: `https://serverest.dev/produtos`,
    headers: {
      Authorization: bearerToken,
    },
    body: {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 1, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 100 }),
    },
    failOnStatusCode: false,
  }).then(response_product => {
    expect(response_product.status).to.eq(201);
    return response_product.body._id;
  });
});

Cypress.Commands.add('createUserCart', (userId, bearerToken, productId) => {
  cy.api({
    method: 'POST',
    url: `https://serverest.dev/carrinhos`,
    headers: {
      Authorization: bearerToken,
    },
    body: {
      produtos: [
        {
          idProduto: productId,
          quantidade: 1,
        },
      ],
    },
    failOnStatusCode: false,
  }).then(response_cart => {
    expect(response_cart.status).to.eq(201);
  });
});