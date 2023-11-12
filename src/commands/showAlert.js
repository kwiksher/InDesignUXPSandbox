const { app } = require("indesign");

const showAlert = () => {
    const dialog = app.dialogs.add();
    const col = dialog.dialogColumns.add();
    const colText = col.staticTexts.add();
    colText.staticLabel = "Congratulations! You just executed your first command.";
    console.log("hello")
    dialog.canCancel = false;
    dialog.show();
    dialog.destroy();
    return;
}

// this is for unit testing, comment out for production
// showAlert ();

module.exports = {showAlert}