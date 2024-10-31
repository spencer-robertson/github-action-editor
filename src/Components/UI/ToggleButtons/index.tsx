import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const ToggleButtons = ({
	yamlEditor,
	setYamlEditor,
}: {
	yamlEditor: boolean;
	setYamlEditor: (value: boolean) => void;
}) => {
	return (
		<ToggleButtonGroup
			color="primary"
			value={yamlEditor ? "yaml" : "ui"}
			exclusive
			onChange={(_, value) => setYamlEditor(value === "yaml")}
			aria-label="Platform"
			fullWidth
		>
			<ToggleButton value="ui">UI</ToggleButton>
			<ToggleButton value="yaml">YAML</ToggleButton>
		</ToggleButtonGroup>
	);
};
