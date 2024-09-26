import { Autocomplete, TextField } from "@mui/material";

export const RepositoryDispatchOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	return (
		<Autocomplete
			multiple
			options={[]}
			id="repository-dispatch-options"
			value={value || []}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
			freeSolo
		/>
	);
};
