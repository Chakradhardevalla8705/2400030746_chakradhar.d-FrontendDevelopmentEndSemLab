const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  const dataFile = path.join(context.globalStorageUri.fsPath, "data.json");

  // Create storage file if not exists
  if (!fs.existsSync(context.globalStorageUri.fsPath)) {
    fs.mkdirSync(context.globalStorageUri.fsPath, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ user: null, courses: [] }, null, 2));
  }

  // Load data
  const loadData = () => JSON.parse(fs.readFileSync(dataFile));

  // Save data
  const saveData = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  // Command: Open Panel
  const openPanel = vscode.commands.registerCommand("extension.openPanel", () => {
    const panel = vscode.window.createWebviewPanel(
      "registerCourses",
      "Registration & Courses",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    const htmlPath = path.join(context.extensionPath, "webview", "index.html");
    let html = fs.readFileSync(htmlPath).toString();

    panel.webview.html = html;

    // handle messages from webview
    panel.webview.onDidReceiveMessage((msg) => {
      const db = loadData();

      if (msg.command === "register") {
        db.user = msg.data;
        saveData(db);
        vscode.window.showInformationMessage("User Registered!");
      }

      if (msg.command === "addCourse") {
        db.courses.push(msg.data);
        saveData(db);
        vscode.window.showInformationMessage("Course Added!");
      }

      if (msg.command === "getData") {
        panel.webview.postMessage(loadData());
      }
    });
  });

  // Command: Add Course (quick input)
  const addCourseCommand = vscode.commands.registerCommand("extension.addCourse", async () => {
    const course = await vscode.window.showInputBox({ prompt: "Enter course name" });
    if (!course) return;

    const db = loadData();
    db.courses.push(course);
    saveData(db);

    vscode.window.showInformationMessage("Course Added: " + course);
  });

  context.subscriptions.push(openPanel, addCourseCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };
