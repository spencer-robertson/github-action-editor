import * as fs from "fs";
import { readFileSync } from "fs";
import * as vscode from "vscode";

export default class ViewLoader {
	private readonly _panel: vscode.WebviewPanel | undefined;
	private fileUri: vscode.Uri | undefined;

	private timer?: ReturnType<typeof setTimeout>;

	constructor(context: vscode.ExtensionContext, fileUri?: vscode.Uri) {
		this.fileUri = fileUri;

		this._panel = vscode.window.createWebviewPanel(
			"github-action-editor",
			"Github action editor",
			vscode.ViewColumn.Two,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
			},
		);

		this._panel?.webview?.onDidReceiveMessage((message) => {
			if (message && typeof message === "object") {
				if (message.action === "save") {
					fs.writeFileSync(message.data.fileUri, message.data.workflow, "utf8");
				}

				if (message.action === "deleteStep") {
					vscode.window
						.showInformationMessage(
							"Do you want to do remove this step?",
							"Yes",
							"No",
						)
						.then((answer) => {
							if (answer === "Yes") {
								this._panel?.webview.postMessage({
									action: "deleteStep",
									jobId: message.jobId,
									id: message.id,
								});
							}

						});
				}

				if (message.action === "deleteJob") {
					vscode.window
						.showInformationMessage(
							"Do you want to remove this job?",
							"Yes",
							"No",
						)
						.then((answer) => {
							if (answer === "Yes") {
								this._panel?.webview.postMessage({
									action: "deleteJob",
									id: message.id,
								});
							}

						});
				}

				if (message.ready) {
					this._panel?.webview.postMessage({
						localConfig: context.globalState.get("localConfig"),
					});

					if (this.isCorrectFileType(vscode.window.activeTextEditor?.document.languageId)) {
						this._panel?.webview.postMessage({
							action: "open",
							template: vscode.window.activeTextEditor?.document.getText(),
						});
					}
				}

				if (message.localConfig) {
					context.globalState.update("localConfig", message.localConfig);
				}
			}
		});
		this.getWebviewContent(context.extensionPath).then((html) => {
			if (this._panel) {
				this._panel.webview.html = html;

				if (this.fileUri) {
					const fileContent = this.getFileContent(this.fileUri);

					if (fileContent) {
						this._panel?.webview.postMessage({
							action: "open",
							template: fileContent,
							fileUri,
						});
					}
				}

				vscode.window.onDidChangeActiveTextEditor((textEditor) => {
					if (this.fileUri && textEditor) {
						const fileContent = this.getFileContent(this.fileUri);

						if (fileContent) {
							this._panel?.webview.postMessage({
								action: "open",
								template: fileContent,
								fileUri: this.fileUri,
							});
						}
					}

					if (this.isCorrectFileType(textEditor?.document.languageId)) {
						this._panel?.webview.postMessage({
							action: "open",
							template: textEditor?.document.getText(),
							fileUri: textEditor?.document.uri,
						});
					}
				});

				vscode.workspace.onDidChangeTextDocument((e) => {
					if (this.isCorrectFileType(e.document.languageId)) {
						if (this.timer) {
							clearTimeout(this.timer);
						}

						this.timer = setTimeout(
							() =>
								this._panel?.webview.postMessage({
									action: "open",
									template: e.document.getText(),
									fileUri: e.document.uri,
								}),
							1000,
						);
					}
				});

				vscode.window.onDidChangeActiveColorTheme((e) => {
					this._panel?.webview.postMessage({
						theme: e.kind,
					});
				});
			}
		});
	}

	private getFileContent(fileUri: vscode.Uri): string | undefined {
		if (fs.existsSync(fileUri.fsPath)) {
			let content = fs.readFileSync(fileUri.fsPath, "utf8");

			return content;
		}
		return undefined;
	}

	private getWebviewContent = (extensionPath: string): Promise<string> => {
		return Promise.resolve().then(() =>
			readFileSync(`${extensionPath}/out/index.html`, "utf-8").replace(
				/\.\//g,
				this._panel?.webview
					.asWebviewUri(vscode.Uri.file(`${extensionPath}/out/`))
					.toString() || "",
			),
		);
	};

	private isCorrectFileType = (fileType?: string) => {
		return fileType === "yaml" ||
			fileType === "github-actions-workflow" ||
			fileType === "plaintext"
	}
}
