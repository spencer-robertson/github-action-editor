import { IconButton } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { X } from "react-feather";

interface StringSettingProps {
	value?: string | number | boolean;
	name: string;
	label?: string;
	multiline?: boolean;
}

export const StringSetting = forwardRef(
	({ value, name, label, multiline }: StringSettingProps, ref) => {
		const [currentValue, setCurrentValue] = useState(value);

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => currentValue;

		useEffect(() => {
			setCurrentValue(value);
		}, [value]);

		return (
			<TextField
				id="outlined-basic"
				placeholder={name}
				variant="outlined"
				value={currentValue}
				onChange={(e) => {
					setCurrentValue(e.target.value);
				}}
				fullWidth
				label={label}
				multiline={multiline}
				InputProps={{
					endAdornment: currentValue && (
						<InputAdornment position="end">
							<IconButton
								onClick={() => {
									setCurrentValue("");
								}}
							>
								<X />
							</IconButton>
						</InputAdornment>
					),
				}}
			/>
		);
	},
);
