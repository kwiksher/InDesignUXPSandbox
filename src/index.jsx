import React from "react";

import { PanelController } from "./controllers/PanelController.jsx";
import { Demos } from "./panels/Demos.jsx";

import { entrypoints } from "uxp";

const demosController = new PanelController(() => <Demos />, {
    id: "demos"
});


// const {runCLI} = require("./commands/tests/run.js");

entrypoints.setup({
    plugin: {
        create(plugin) {
            /* optional */ console.log("created", plugin);
        },
        destroy() {
            /* optional */ console.log("destroyed");
        }
    },
    panels: {
        demos: demosController,
        test:{
          create(event){
            console.Console.log("#####")
            // runCLI();
          }
        }
    }
});
