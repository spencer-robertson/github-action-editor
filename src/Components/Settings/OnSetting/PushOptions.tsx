import { Autocomplete, TextField } from "@mui/material";

export const PushOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: string[]) => void;
}) => {
	return (
		<>
			<Autocomplete
				multiple
				id="push-options-branches"
				options={[]}
				value={value?.branches || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="push-options-branches-ignore"
				options={[]}
				value={value?.["branches-ignore"] || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches ignore"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches-ignore", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="push-options-paths"
				options={[]}
				value={value?.paths || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Paths"} />
				)}
				onChange={(_, value) => {
					onChange?.("paths", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="push-options-paths-ignore"
				options={[]}
				value={value?.["paths-ignore"] || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Paths ignore"} />
				)}
				onChange={(_, value) => {
					onChange?.("paths-ignore", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="push-options-tags"
				options={[]}
				value={value?.tags || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => <TextField {...params} placeholder={"Tags"} />}
				onChange={(_, value) => {
					onChange?.("tags", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="push-options-tags-ignore"
				options={[]}
				value={value?.["tags-ignore"] || []}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Tags ignore"} />
				)}
				onChange={(_, value) => {
					onChange?.("tags-ignore", value);
				}}
				freeSolo
			/>
		</>
	);
};
