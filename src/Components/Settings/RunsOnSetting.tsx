import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface RunsOnSettingProps {
	value: string | string[];
	name: string;
	onChange?: (value: string | string[]) => void;
}

export const RunsOnSetting = ({
	value,
	name,
	onChange,
}: RunsOnSettingProps) => {
	const currentValue = value ? (Array.isArray(value) ? value : [value]) : [];

	const machines = [
		"windows-latest",
		"windows-2022",
		"windows-2019",
		"ubuntu-latest",
		"ubuntu-24.04",
		"ubuntu-22.04",
		"ubuntu-20.04",
		"macos-latest",
		"macos-latest-large",
		"macos-14",
		"macos-14-large",
		"macos-13",
		"macos-13-large",
		"macos-12",
		"macos-12-large",
		"macos-11",
		"self-hosted",
	];

	return (
		<Autocomplete
			multiple
			id="tags-outlined"
			options={machines}
			value={currentValue}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={name} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
			freeSolo
		/>
	);
};
