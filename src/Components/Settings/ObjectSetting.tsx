import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useState } from "react";

interface ObjectSettingProps {
	value?: Record<string, string | number | boolean>;
	name: string;
	onChange?: (
		value: Record<string, string | number | boolean> | undefined,
	) => void;
}

export const ObjectSetting = ({
	value,
	name,
	onChange,
}: ObjectSettingProps) => {
	const [nameValue, setNameValue] = useState<string>();
	const [objectValue, setObjectValue] = useState<string>();

	const onRemove = (name: string) => {
		const { [name]: _, ...rest } = value || {};
		onChange?.(rest);
	};

	const onChangeValue = (
		newObjectValue: Record<string, string>,
		original?: string,
	) => {
		// set value to new value with test and remove original key from value
		if (original) {
			const { [original]: _, ...rest } = value || {};

			onChange?.({ ...rest, ...newObjectValue });
		}

		onChange?.({ ...value, ...newObjectValue });
	};

	const onClick = () => {
		if (!objectValue || !nameValue) return;

		const newObjectValue = { [nameValue]: objectValue };

		if (name !== nameValue) {
			onChangeValue(newObjectValue, name);
		} else {
			onChangeValue(newObjectValue);
		}

		setNameValue("");
		setObjectValue("");
	};

	return (
		<Table aria-label="simple table">
			<TableBody>
				{Object.entries(value || {}).map(([name, newValue]) => (
					<TableRow key={name}>
						<TableCell component="th" scope="row" width={"20%"}>
							{name}
						</TableCell>
						<TableCell>{newValue}</TableCell>
						<TableCell align="right">
							<IconButton
								edge="end"
								aria-label="delete"
								title="Delete"
								onClick={() => onRemove(name)}
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
								setObjectValue(e.target.value);
							}}
							value={objectValue}
							fullWidth
						/>
					</TableCell>
					<TableCell align="right">
						<IconButton
							edge="end"
							aria-label="add"
							title="Add"
							disabled={!nameValue || !objectValue}
							onClick={onClick}
						>
							<AddIcon />
						</IconButton>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
};
