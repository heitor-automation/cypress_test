Feature: Frontend Tests E2E

  Scenario Outline: Login scenarios
    Given the user access the home page of server "<email>" "<pass>" "<type>"
    When the user try to login with credentials "<email>" "<pass>"
    Then the user will validate according to the scenario "<type>"
    Examples:
      | email             | pass | type     |
      | test@test.com     | open | negative |
      | e2eTest@email.com | null | negative |
      | e2eTest@email.com | open | positive |

  Scenario Outline: Subscribe User scenarios
    Given the user access the home page of server with right credentials
    And the user click in subscribe new "<type_right>"
    When the user fill the new credentials "<email>" "<pass>" "<name>"
    And the user send the form "<type_wrong>" "<type_right>"
    Then the user will validate that the user is "<state>"
    Examples:
      | email         | pass | name     | state   | type_wrong       | type_right       |
      | e2eTest@email | open | John Doe | invalid | cadastrarUsuario | cadastrarUsuario |
      | validEmail    | open | John Doe | valid   | cadastrarUsuario | cadastrarUsuario |

  Scenario Outline: Subscribe Product scenarios
    Given the user access the home page of server with right credentials
    And the user click in subscribe new "<type_right>"
    When the user fill the new product information "<valid>"
    And the user send the form "<type_wrong>" "<type_right>"
    Then the user will validate that the product is "<valid>"
    Examples:
      | valid           | type_wrong      | type_right       |
      | valid_product   | cadastarProduto | cadastrarProduto |
      | invalid_product | cadastarProduto | cadastrarProduto |