import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface ObjectSettingProps {
	value?: Record<string, string | number | boolean>;
	name: string;
}

export const ObjectSetting = forwardRef(
	({ value, name }: ObjectSettingProps, ref) => {
		const [currentValue, setCurrentValue] = useState(value);

		const [nameValue, setNameValue] = useState<string>();
		const [objectValue, setObjectValue] = useState<string>();

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => currentValue;

		const onRemove = (name: string) => {
			setCurrentValue((prev) => {
				const { [name]: _, ...rest } = prev || {};
				return rest;
			});
		};

		useEffect(() => {
			setCurrentValue(value);
		}, [value]);

		const onChange = (
			newObjectValue: Record<string, string>,
			original?: string,
		) => {
			// set value to new value with test and remove original key from value
			setCurrentValue((prev) => {
				if (original) {
					const { [original]: _, ...rest } = prev || {};
					return { ...rest, ...newObjectValue };
				}

				const { ...rest } = prev || {};
				return { ...rest, ...newObjectValue };
			});
		};

		const onClick = () => {
			if (!objectValue || !nameValue) return;

			const newObjectValue = { [nameValue]: objectValue };

			if (name !== nameValue) {
				onChange(newObjectValue, name);
			} else {
				onChange(newObjectValue);
			}

			setNameValue("");
			setObjectValue("");
		};

		return (
			<Table aria-label="simple table">
				<TableBody>
					{Object.entries(currentValue || {}).map(([name, value]) => (
						<TableRow key={name}>
							<TableCell component="th" scope="row" width={"20%"}>
								{name}
							</TableCell>
							<TableCell>{value}</TableCell>
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
	},
);
