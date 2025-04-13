Feature: Frontend Tests E2E

  Scenario Outline: Create User by API
    Given the user has the body to create a user "<field>" "<type>"
    When the user send the request to POSTcreatUser
    Then the user will validate the api response according to the scenario "<type>" "<field>"
    Examples:
      | field         | type     |
      | nome          | negative |
      | email         | negative |
      | password      | negative |
      | administrador | negative |
      | valid         | positive |

  Scenario Outline: Updated User by API
    Given the user has the body to update a user "<field>"
    When the user send the request to PUTupdatUser
    Then the user will validate the api update response according to the scenario "<type>"
    Examples:
      | field              | type     |
      | new_user           | positive |
      | valid_user         | positive |
      | missing_informtion | negative |

  Scenario Outline: Delete User by API
    Given the user has the id to delete a user "<field>"
    When the user send the request to DELETEdeleteUser
    Then the user will validate the api delete response according to the scenario "<type>"
    Examples:
      | field              | type     |
      | new_user           | positive |
      | invalid_user       | positive |
      | user_with_cart     | negative |
