import { Autocomplete, TextField } from "@mui/material";

export const PullRequestReviewCommentOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="pull-request-review-comment-options"
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
