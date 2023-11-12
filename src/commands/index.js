const { entrypoints } = require("uxp");

const {showAlert} = require("./showAlert.js");
const { importFigma } = require("./importFigma.js");

const {runCLI} = require("./tests/importFigma.test.js")

entrypoints.setup({
    commands: {
        showAlert: () => showAlert(),
        importFigma:() => importFigma(),
        jest:() => runCLI()
    },
})

runCLI();