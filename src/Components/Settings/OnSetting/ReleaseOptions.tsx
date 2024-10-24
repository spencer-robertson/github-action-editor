import { Autocomplete, TextField } from "@mui/material";

export const ReleaseOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = [
		"published",
		"unpublished",
		"created",
		"edited",
		"deleted",
		"prereleased",
		"released",
	];

	return (
		<Autocomplete
			multiple
			id="release-options"
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
