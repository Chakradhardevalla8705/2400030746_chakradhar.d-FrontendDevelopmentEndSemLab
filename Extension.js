const vscode = require("vscode");

function activate(context) {
  let data = {
    user: null,
    courses: []
  };

  // Main command
  let disposable = vscode.commands.registerCommand("extension.openFeatures", async () => {

    // If user not registered → register first
    if (!data.user) {
      const name = await vscode.window.showInputBox({ prompt: "Enter your name" });
      const email = await vscode.window.showInputBox({ prompt: "Enter your email" });

      data.user = { name, email };
      vscode.window.showInformationMessage("Registration successful!");
    }

    // After registration show menu
    while (true) {
      const option = await vscode.window.showQuickPick(
        ["Add Course", "View Courses", "Exit"],
        { placeHolder: "Choose an option" }
      );

      if (option === "Add Course") {
        const course = await vscode.window.showInputBox({ prompt: "Enter course name" });
        if (course) {
          data.courses.push(course);
          vscode.window.showInformationMessage("Course added: " + course);
        }
      }

      else if (option === "View Courses") {
        if (data.courses.length === 0) {
          vscode.window.showInformationMessage("No courses added yet.");
        } else {
          vscode.window.showQuickPick(data.courses, { placeHolder: "Your Courses" });
        }
      }

      else if (option === "Exit") {
        break;
      }
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
