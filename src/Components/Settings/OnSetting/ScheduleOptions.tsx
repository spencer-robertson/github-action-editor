import { Autocomplete, TextField } from "@mui/material";

export const ScheduleOptions = ({
	value,
	onChange,
}: {
	value: { cron: string }[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	return (
		<Autocomplete
			multiple
			id="schedule-options"
			options={[]}
			value={value?.map(({ cron }) => cron) || []}
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
