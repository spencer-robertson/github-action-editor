import Checkbox from "@mui/material/Checkbox";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import style from "./BooleanSetting.module.scss";

interface BooleanSettingProps {
	value?: string | boolean;
}
export const BooleanSetting = forwardRef(
	({ value }: BooleanSettingProps, ref) => {
		const [currentValue, setCurrentValue] = useState(value);

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => currentValue;

		useEffect(() => {
			setCurrentValue(value);
		}, [value]);

		return (
			<div className={style.container}>
				<Checkbox
					sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
					checked={!!currentValue}
					onChange={(e) => {
						setCurrentValue(e.target.checked);
					}}
				/>
			</div>
		);
	},
);
