import { Autocomplete, TextField } from "@mui/material";

export const CheckSuiteOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["completed", "requested", "rerequested"];

	return (
		<Autocomplete
			multiple
			id="check-suite-options"
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
