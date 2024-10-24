import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Defaults } from "../../types/workflowTypes";
import { BaseSetting } from "./BaseSetting";
import style from "./DefaultsSetting.module.scss";
import { StringSetting } from "./StringSetting";

interface DefaultsSettingProps {
	value?: Defaults;
	name: string;
	onChange?: (value: Defaults | undefined) => void;
}

export const DefaultsSetting = ({
	value,
	name,
	onChange,
}: DefaultsSettingProps) => {
	const [nameValue, setNameValue] = useState<string>();
	const [defaultValue, setDefaultValue] = useState<string>();

	const { run: runValue, ...valueWithoutRun } = value || {};

	const defaultValues = Object.entries(valueWithoutRun || {})?.map(
		([name, value]) => ({
			name,
			value: value as string,
		}),
	);

	const onRemove = (name: string) => {
		const { [name]: _, ...rest } = value || {};
		onChange?.(rest);
	};

	const onChangeValue = (
		defaultValue: Record<string, string>,
		original?: string,
	) => {
		// set value to new value with test and remove original key from value
		if (original) {
			const { [original]: _, ...rest } = value || {};

			onChange?.({ ...rest, ...defaultValue });
			return { ...rest, ...defaultValue };
		}

		const { ...rest } = value || {};

		onChange?.({ ...rest, ...defaultValue });
		return { ...rest, ...defaultValue };
	};

	const onClick = () => {
		if (!defaultValue || !nameValue) {
			return;
		}

		const newDefaultValue = { [nameValue]: defaultValue };

		if (name !== nameValue) {
			onChangeValue(newDefaultValue, name);
		} else {
			onChangeValue(newDefaultValue);
		}

		setNameValue("");
		setDefaultValue("");
	};

	return (
		<>
			<BaseSetting
				settingName="Run"
				settingDetails="Provide default shell and working-directory to all run steps in the job."
			></BaseSetting>
			<div className={style.run}>
				<StringSetting
					value={runValue?.shell}
					name="Shell"
					onChange={(newValue) => {
						if (typeof newValue === "string") {
							const { run, ...rest } = value || {};

							onChange?.({
								run: { ...run, shell: newValue },
								...rest,
							});
						}
					}}
				/>
				<StringSetting
					value={runValue?.["working-directory"]}
					name="Working directory"
					onChange={(newValue) => {
						if (typeof newValue === "string") {
							const { run, ...rest } = value || {};

							onChange?.({
								run: { ...run, "working-directory": newValue },
								...rest,
							});
						}
					}}
				/>
			</div>
			<BaseSetting
				settingName="Defaults"
				settingDetails="Default settings that will apply to all steps in the job"
			></BaseSetting>
			<Table aria-label="simple table">
				<TableBody>
					{defaultValues.map((row) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row" width={"20%"}>
								{row.name}
							</TableCell>
							<TableCell>{row.value}</TableCell>
							<TableCell align="right">
								<IconButton
									edge="end"
									aria-label="delete"
									title="Delete"
									onClick={() => onRemove(row.name)}
								>
									<DeleteIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
					<TableRow key={"new"}>
						<TableCell component="th" scope="row" width={"20%"}>
							<TextField
								id="outlined-basic"
								label="Name"
								variant="standard"
								onChange={(e) => {
									setNameValue(e.target.value);
								}}
								value={nameValue}
								fullWidth
							/>
						</TableCell>
						<TableCell>
							<TextField
								id="outlined-basic"
								label="Value"
								variant="standard"
								onChange={(e) => {
									setDefaultValue(e.target.value);
								}}
								value={defaultValue}
								fullWidth
							/>
						</TableCell>
						<TableCell align="right">
							<IconButton
								edge="end"
								aria-label="add"
								title="Add"
								disabled={!nameValue || !defaultValue}
								onClick={onClick}
							>
								<AddIcon />
							</IconButton>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
};
