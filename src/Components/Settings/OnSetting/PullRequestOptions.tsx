import { Autocomplete, TextField } from "@mui/material";

export const PullRequestOptions = ({
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
		"locked",
		"unlocked",
		"enqueued",
		"dequeued",
		"milestoned",
		"demilestoned",
		"ready_for_review",
		"review_requested",
		"review_request_removed",
		"auto_merge_enabled",
		"auto_merge_disabled",
	];

	return (
		<>
			<Autocomplete
				multiple
				id="pull-request-options"
				options={options}
				value={value?.types}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
				onChange={(_, value) => {
					onChange?.("types", value);
				}}
			/>
			<Autocomplete
				multiple
				id="pull-request-options-branches"
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
				id="pull-request-options-branches-ignore"
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
			<Autocomplete
				multiple
				id="pull-request-options-paths"
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
			<Autocomplete
				multiple
				id="pull-request-options-paths-ignore"
				options={[]}
				value={value?.["paths-ignore"] || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Paths ignore"} />
				)}
				onChange={(_, value) => {
					onChange?.("paths-ignore", value);
				}}
				freeSolo
			/>
		</>
	);
};
