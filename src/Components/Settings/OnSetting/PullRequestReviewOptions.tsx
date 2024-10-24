import { Autocomplete, TextField } from "@mui/material";

export const PullRequestReviewOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["submitted", "edited", "dismissed"];

	return (
		<Autocomplete
			multiple
			id="pull-request-review-options"
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
