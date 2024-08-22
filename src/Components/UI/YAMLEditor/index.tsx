import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml";
import { linter, lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { useState } from "react";
import YAML from "yaml";

export const YamlEditor = ({ value, onChange }: any) => {
	const [currentValue] = useState(value);
	const yaml = new LanguageSupport(StreamLanguage.define(yamlMode.yaml));

	const yamlLinter = linter((view) => {
		const jsyaml = require("js-yaml");

		let diagnostics = [];
		// console.log(view); This is the EditorView
		// console.log(view.state); This is the EditorState
		// console.log(view.state.doc); This is the object type Textleaf containing Editor text and related info.
		try {
			jsyaml.load(view.state.doc);
		} catch (e: any) {
			var loc = e.mark;
			var from = loc ? loc.position : 0;
			var to = from;
			var severity = "error" as any;
			diagnostics.push({
				from: from,
				to: to,
				message: e.message,
				severity: severity,
			});
		}
		return diagnostics;
	});

	return (
		<CodeMirror
			value={YAML.stringify(currentValue)}
			extensions={[yaml, basicSetup, lintGutter(), yamlLinter]}
			onChange={(value) => {
				console.log("value:", YAML.parse(value));
				onChange(YAML.parse(value));
			}}
		/>
	);
};

export default YamlEditor;
