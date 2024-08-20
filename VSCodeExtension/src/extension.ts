import * as vscode from "vscode";
import ViewLoader from "./ViewLoader";

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		"github-action-editor.editAction",
		(args) => {
			return new ViewLoader(context, args);
		},
	);
	context.subscriptions.push(disposable);
}

export function deactivate() {}
