const cucumber = require("cypress-cucumber-preprocessor").default
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", cucumber())
    },
    specPattern: "cypress/e2e/features/**/*.feature",
    defaultCommandTimeout: 10000,
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
})
