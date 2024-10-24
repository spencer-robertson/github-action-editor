import { Autocomplete, TextField } from "@mui/material";

export const CheckRunOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "rerequested", "completed", "requested_action"];

	return (
		<Autocomplete
			multiple
			id="check-run-options"
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
