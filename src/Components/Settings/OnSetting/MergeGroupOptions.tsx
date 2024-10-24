import { Autocomplete, TextField } from "@mui/material";

export const MergeGroupOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["checks_requested"];

	return (
		<Autocomplete
			multiple
			id="merge-group-options"
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
