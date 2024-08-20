import TextField from "@mui/material/TextField";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface NumberSettingProps {
	value?: number | string;
}

export const NumberSetting = forwardRef(
	({ value }: NumberSettingProps, ref) => {
		const [currentValue, setCurrentValue] = useState(value);

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => currentValue;

		useEffect(() => {
			setCurrentValue(value);
		}, [value]);

		return (
			<TextField
				id="outlined-basic"
				placeholder={"360"}
				variant="outlined"
				type="number"
				value={currentValue}
				onChange={(e) => setCurrentValue(Number(e.target.value))}
				fullWidth
			/>
		);
	},
);
