import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { SettingsRef } from "../../types";
import { Defaults } from "../../types/workflowTypes";
import { BaseSetting } from "./BaseSetting";
import { StringSetting } from "./StringSetting";

interface DefaultsSettingProps {
	value?: Defaults;
	name: string;
}

export const DefaultsSetting = forwardRef(
	({ value, name }: DefaultsSettingProps, ref) => {
		const [currentValue, setCurrentValue] = useState(value);

		const [nameValue, setNameValue] = useState<string>();
		const [defaultValue, setDefaultValue] = useState<string>();

		const shellRef = useRef<SettingsRef>(null);
		const directoryRef = useRef<SettingsRef>(null);

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => {
			const shellValue = shellRef?.current?.getValue();
			const directoryValue = directoryRef?.current?.getValue();

			if (shellValue || directoryValue) {
				return {
					run: { shell: shellValue, "working-directory": directoryValue },
					...currentValue,
				};
			}

			return { ...currentValue };
		};

		const onRemove = (name: string) => {
			setCurrentValue((prev) => {
				const { [name]: _, ...rest } = prev || {};
				return rest;
			});
		};

		useEffect(() => {
			setCurrentValue(value);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [JSON.stringify(value)]);

		const { run: runValue, ...valueWithoutRun } = currentValue || {};

		const defaultValues = Object.entries(valueWithoutRun || {})?.map(
			([name, value]) => ({
				name,
				value: value as string,
			}),
		);

		const onChange = (
			defaultValue: Record<string, string>,
			original?: string,
		) => {
			// set value to new value with test and remove original key from value
			setCurrentValue((prev) => {
				if (original) {
					const { [original]: _, ...rest } = prev || {};
					return { ...rest, ...defaultValue };
				}

				const { ...rest } = prev || {};
				return { ...rest, ...defaultValue };
			});
		};

		const onClick = () => {
			if (!defaultValue || !nameValue) {
				return;
			}

			const newDefaultValue = { [nameValue]: defaultValue };

			if (name !== nameValue) {
				onChange(newDefaultValue, name);
			} else {
				onChange(newDefaultValue);
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
				<StringSetting ref={shellRef} value={runValue?.shell} name="Shell" />
				<StringSetting
					ref={directoryRef}
					value={runValue?.["working-directory"]}
					name="Working directory"
				/>
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
	},
);
