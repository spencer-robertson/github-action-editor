import { IconButton } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism.css"; //Example style, you can use another
import { X } from "react-feather";
import Editor from "react-simple-code-editor";
import style from "./StringSetting.module.scss";

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
	if (multiline) {
		return (
			<Editor
				value={(value as any) || ""}
				onValueChange={(code) => onChange?.(code)}
				highlight={(code) => highlight(code, languages.bash, "Bash")}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 14,
				}}
				className={style.editor}
			/>
		);
	}
	return (
		<TextField
			id="outlined-basic"
			placeholder={name}
			variant="outlined"
			value={value || ""}
			onChange={(e) => {
				onChange?.(e.target.value);
			}}
			fullWidth
			label={label}
			multiline={multiline}
			className={style.textField}
			InputProps={{
				endAdornment: value && (
					<InputAdornment position="end">
						<IconButton
							onClick={() => {
								onChange?.(undefined);
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
