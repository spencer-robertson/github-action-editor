import { Autocomplete, TextField } from "@mui/material";

export const MileStoneOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "closed", "opened", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="milestone-options"
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
