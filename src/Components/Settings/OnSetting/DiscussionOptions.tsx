import { Autocomplete, TextField } from "@mui/material";

export const DiscussionOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = [
		"created",
		"edited",
		"deleted",
		"transferred",
		"pinned",
		"unpinned",
		"labeled",
		"unlabeled",
		"locked",
		"unlocked",
		"category_changed",
		"answered",
		"unanswered",
	];

	return (
		<Autocomplete
			multiple
			id="discussion-options"
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
