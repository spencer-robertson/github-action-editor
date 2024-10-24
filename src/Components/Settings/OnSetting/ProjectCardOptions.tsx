import { Autocomplete, TextField } from "@mui/material";

export const ProjectCardOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "converted", "moved", "deleted"];

	return (
		<Autocomplete
			multiple
			id="project-card-options"
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
