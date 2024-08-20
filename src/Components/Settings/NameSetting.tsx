import Input from "@mui/material/Input";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import style from "./NameSetting.module.scss";

interface NameSettingProps {
	value?: string;
}

export const NameSetting = forwardRef(({ value }: NameSettingProps, ref) => {
	const [currentValue, setCurrentValue] = useState(value);

	useImperativeHandle(ref, () => ({ getValue }));
	const getValue = () => currentValue;

	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	return (
		<div className={style.title}>
			<Input
				defaultValue={currentValue}
				fullWidth
				style={{
					fontSize: 20,
				}}
				onChange={(e) => setCurrentValue(e.target.value)}
			/>
		</div>
	);
});
