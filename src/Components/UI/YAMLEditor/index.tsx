import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml";
import { linter, lintGutter } from "@codemirror/lint";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { createRef, useEffect, useState } from "react";
import YAML from "yaml";
import { NormalJob, Step, Workflow } from "../../../types/workflowTypes";

type YamlEditorProps =
	| {
			word?: string;
			value: NormalJob;
			onChange: (value: NormalJob) => void;
	  }
	| {
			word?: string;

			value: Step;
			onChange: (value: Step) => void;
	  }
	| {
			word?: string;

			value: Workflow;
			onChange: (value: Workflow) => void;
	  };

export const YamlEditor = ({ word, value, onChange }: YamlEditorProps) => {
	const [currentValue] = useState(YAML.stringify(value));
	const newWord = word + ":";
	const ref = createRef<ReactCodeMirrorRef>();

	const yaml = new LanguageSupport(StreamLanguage.define(yamlMode.yaml));

	const yamlLinter = linter((view) => {
		const jsyaml = require("js-yaml");

		let diagnostics = [];

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

	useEffect(() => {
		const stringValue = YAML.stringify(value);
		console.log("stringValue:", stringValue);

		if (word && stringValue) {
			const index = stringValue.indexOf(newWord);
			console.log("index:", index);

			if (index !== -1) {
				ref.current?.view?.dispatch({
					selection: {
						anchor: stringValue.indexOf(newWord),
						head: stringValue.indexOf(newWord) + newWord.length,
					},
					// Ensure the selection is shown in viewport
					scrollIntoView: true,
				});
			} else {
				ref.current?.view?.dispatch({
					selection: {
						anchor: 0,
						head: 0,
					},
				});
			}
		} else {
			ref.current?.view?.dispatch({
				selection: {
					anchor: 0,
					head: 0,
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [word]);

	return (
		<CodeMirror
			ref={ref}
			value={currentValue}
			extensions={[yaml, basicSetup, lintGutter(), yamlLinter]}
			onChange={(value) => {
				onChange(YAML.parse(value));
			}}
			selection={
				word && currentValue.indexOf(newWord) !== -1
					? {
							anchor: currentValue.indexOf(newWord),
							head: currentValue.indexOf(newWord) + newWord.length,
					  }
					: undefined
			}
		/>
	);
};

export default YamlEditor;
