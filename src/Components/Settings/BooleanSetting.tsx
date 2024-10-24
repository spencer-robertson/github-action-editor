import Checkbox from "@mui/material/Checkbox";
import style from "./BooleanSetting.module.scss";

interface BooleanSettingProps {
	value?: string | boolean;
	onChange?: (value: string | boolean | undefined) => void;
}
export const BooleanSetting = ({ value, onChange }: BooleanSettingProps) => {
	return (
		<div className={style.container}>
			<Checkbox
				sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
				checked={!!value}
				onChange={(e) => {
					onChange?.(e.target.checked);
				}}
			/>
		</div>
	);
};
