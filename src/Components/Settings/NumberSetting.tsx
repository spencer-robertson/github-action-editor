import TextField from "@mui/material/TextField";

interface NumberSettingProps {
	value?: number | string;
	onChange?: (value: number | string | undefined) => void;
}

export const NumberSetting = ({ value, onChange }: NumberSettingProps) => {
	return (
		<TextField
			id="outlined-basic"
			placeholder={"360"}
			variant="outlined"
			type="number"
			value={value}
			onChange={(e) => {
				onChange?.(Number(e.target.value));
			}}
			fullWidth
		/>
	);
};
