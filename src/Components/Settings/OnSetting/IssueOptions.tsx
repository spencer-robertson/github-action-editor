import { Autocomplete, TextField } from "@mui/material";

export const IssueOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = [
		"opened",
		"edited",
		"deleted",
		"transferred",
		"pinned",
		"unpinned",
		"closed",
		"reopened",
		"assigned",
		"unassigned",
		"labeled",
		"unlabeled",
		"locked",
		"unlocked",
		"milestoned",
		"demilestoned",
	];

	return (
		<Autocomplete
			multiple
			id="issue-options"
			options={options}
			value={value || []}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};
