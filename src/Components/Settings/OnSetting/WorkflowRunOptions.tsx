import { Autocomplete, TextField } from "@mui/material";

export const WorkflowRunOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: string[]) => void;
}) => {
	const options = ["completed", "requested", "in_progress"];

	return (
		<>
			<Autocomplete
				multiple
				id="workflow-run-options-types"
				options={options}
				value={value?.types || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Types"} />
				)}
				onChange={(_, value) => {
					onChange?.("types", value);
				}}
			/>
			<Autocomplete
				multiple
				id="workflow-run-options-workflows"
				options={[]}
				value={value?.workflows || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Workflows"} />
				)}
				onChange={(_, value) => {
					onChange?.("workflows", value);
				}}
				freeSolo
			/>

			<Autocomplete
				multiple
				id="workflow-run-options-branches"
				options={[]}
				value={value?.branches || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches", value);
				}}
				freeSolo
			/>

			<Autocomplete
				multiple
				id="workflow-run-options-branches-ignore"
				options={[]}
				value={value?.["branches-ignore"] || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches ignore"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches-ignore", value);
				}}
				freeSolo
			/>
		</>
	);
};
