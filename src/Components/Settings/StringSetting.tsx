import { IconButton } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { X } from "react-feather";

interface StringSettingProps {
	value?: string | number | boolean;
	name: string;
	onChange?: (value: string | number | boolean | undefined) => void;
	label?: string;
	multiline?: boolean;
}

export const StringSetting = ({
	value,
	name,
	label,
	multiline,
	onChange,
}: StringSettingProps) => {
	return (
		<TextField
			id="outlined-basic"
			placeholder={name}
			variant="outlined"
			value={value}
			onChange={(e) => {
				onChange?.(e.target.value);
			}}
			fullWidth
			label={label}
			multiline={multiline}
			InputProps={{
				endAdornment: value && (
					<InputAdornment position="end">
						<IconButton
							onClick={() => {
								onChange?.("");
							}}
						>
							<X />
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
};
