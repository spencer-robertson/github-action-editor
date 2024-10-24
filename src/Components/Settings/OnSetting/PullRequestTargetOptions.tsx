import { Autocomplete, TextField } from "@mui/material";

export const PullRequestTargetOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: string[]) => void;
}) => {
	const options = [
		"assigned",
		"unassigned",
		"labeled",
		"unlabeled",
		"opened",
		"edited",
		"closed",
		"reopened",
		"synchronize",
		"converted_to_draft",
		"ready_for_review",
		"locked",
		"unlocked",
		"review_requested",
		"review_request_removed",
		"auto_merge_enabled",
		"auto_merge_disabled",
	];

	return (
		<>
			<Autocomplete
				multiple
				id="pull-request-target-options"
				options={options}
				value={value?.types || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
				onChange={(_, value) => {
					onChange?.("types", value);
				}}
			/>
			<Autocomplete
				multiple
				id="pull-request-target-options-branches"
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
				id="pull-request-target-options-paths"
				options={[]}
				value={value?.paths || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Paths"} />
				)}
				onChange={(_, value) => {
					onChange?.("paths", value);
				}}
				freeSolo
			/>
		</>
	);
};
