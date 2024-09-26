import { AddCircleOutline, Edit } from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Checkbox,
	FormControlLabel,
	IconButton,
	TextField,
} from "@mui/material";
import { useState } from "react";
import { cn } from "../../../utils";
import style from "./OnSetting.module.scss";

export const WorkflowDispatchOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: Record<string, unknown> | undefined) => void;
}) => {
	const options = ["boolean", "choice", "number", "environment", "string"];
	const [input, setInput] = useState<string | null>(null);
	const [description, setDescription] = useState<string | null>(null);
	const [required, setRequired] = useState<boolean | null>(null);
	const [defaultValue, setDefaultValue] = useState<string | null>(null);
	const [type, setType] = useState<string | null>(null);
	const [optionsValue, setOptionsValue] = useState<string[]>([]);
	const [inputs, setInputs] = useState<Record<string, unknown>>(
		value?.inputs || {},
	);

	const onAddClicked = () => {
		if (input) {
			if (
				!description &&
				!required &&
				!defaultValue &&
				!type &&
				!optionsValue?.length
			) {
				setInputs((prev) => ({
					...prev,
					[input]: null,
				}));

				onChange("inputs", {
					...inputs,
					[input]: null,
				});
			}

			const newInput = {
				description: description ? description : undefined,
				required: required ? required : undefined,
				default: defaultValue ? defaultValue : undefined,
				type: type ? type : undefined,
				options: optionsValue?.length ? optionsValue : undefined,
			};

			setInputs((prev) => ({
				...prev,
				[input]: newInput,
			}));

			onChange("inputs", {
				...inputs,
				[input]: newInput,
			});
		}
	};

	const setNewInput = (title: string, newInput: any) => {
		setInputs((prev) => ({
			...prev,
			[title]: newInput,
		}));

		onChange("inputs", {
			...inputs,
			[title]: newInput,
		});
	};

	return (
		<>
			<Card>
				<CardHeader
					title="New input"
					action={
						<FormControlLabel
							control={
								<Checkbox
									sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
									checked={!!required}
									onChange={(e) => {
										setRequired?.(e.target.checked);
									}}
								/>
							}
							label="Required"
						/>
					}
				/>
				<CardContent className={cn(style.container, style.cardContent)}>
					<TextField
						id="input"
						label="Input name"
						variant="standard"
						onChange={(e) => {
							setInput(e.target.value);
						}}
						value={input}
						fullWidth
					/>
					<TextField
						id="description"
						label="Input description"
						variant="standard"
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						value={description}
						fullWidth
					/>

					<TextField
						id="default"
						label="Input default value"
						variant="standard"
						onChange={(e) => {
							setDefaultValue(e.target.value);
						}}
						value={defaultValue}
						fullWidth
					/>
					<Autocomplete
						id="workflow-dispatch-options-types"
						options={options}
						value={type}
						getOptionLabel={(option) => option}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField {...params} placeholder={"Type"} />
						)}
						onChange={(_, value) => {
							setType?.(value);

							if (value !== "choice") {
								setOptionsValue([]);
							}
						}}
					/>
					{type === "choice" && (
						<Autocomplete
							multiple
							id="options"
							options={[]}
							value={optionsValue}
							getOptionLabel={(option) => option}
							filterSelectedOptions
							renderInput={(params) => (
								<TextField {...params} placeholder={"Options"} />
							)}
							onChange={(_, value) => {
								setOptionsValue(value);
							}}
							freeSolo
						/>
					)}
					<CardActions>
						<IconButton aria-label="Add" onClick={onAddClicked}>
							<AddCircleOutline />
						</IconButton>
					</CardActions>
				</CardContent>
			</Card>
			{Object.entries(inputs || {})?.map(([title, input]) => {
				return (
					<InputCard
						input={input}
						title={title}
						setNewInput={(newInput) => setNewInput(title, newInput)}
					/>
				);
			})}
		</>
	);
};

const InputCard = ({
	title,
	input,
	setNewInput,
}: {
	title: string;
	input: any;
	setNewInput: (input: any) => void;
}) => {
	const options = ["choice", "boolean", "environment", "string"];
	const [description, setDescription] = useState<string | null>(
		input?.description,
	);
	const [required, setRequired] = useState<boolean | null>(input?.required);
	const [defaultValue, setDefaultValue] = useState<string | null>(
		input?.default,
	);
	const [type, setType] = useState<string | null>(input?.type);
	const [optionsValue, setOptionsValue] = useState<string[]>(
		input?.options || [],
	);
	const [editInput, setEditInput] = useState<string | null>(null);

	const onAddClicked = () => {
		const newInput = {
			description: description ? description : undefined,
			required: required ? required : undefined,
			default: defaultValue ? defaultValue : undefined,
			type: type ? type : undefined,
			options: optionsValue?.length ? optionsValue : undefined,
		};

		setNewInput(newInput);
		setEditInput(null);
	};

	if (editInput === title) {
		return (
			<Card>
				<CardHeader
					title={title}
					action={
						<FormControlLabel
							control={
								<Checkbox
									sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
									checked={!!required}
									onChange={(e) => {
										setRequired?.(e.target.checked);
									}}
								/>
							}
							label="Required"
						/>
					}
				/>
				<CardContent className={cn(style.container, style.cardContent)}>
					<TextField
						id="description"
						label="Input description"
						variant="standard"
						onChange={(e) => {
							setDescription(e.target.value);
						}}
						value={description}
						fullWidth
					/>

					<TextField
						id="default"
						label="Input default value"
						variant="standard"
						onChange={(e) => {
							setDefaultValue(e.target.value);
						}}
						value={defaultValue}
						fullWidth
					/>
					<Autocomplete
						id="workflow-dispatch-options-types"
						options={options}
						value={type}
						getOptionLabel={(option) => option}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField {...params} placeholder={"Type"} />
						)}
						onChange={(_, value) => {
							setType?.(value);

							if (value !== "choice") {
								setOptionsValue([]);
							}
						}}
					/>
					{type === "choice" && (
						<Autocomplete
							multiple
							id="options"
							options={[]}
							value={optionsValue}
							getOptionLabel={(option) => option}
							filterSelectedOptions
							renderInput={(params) => (
								<TextField {...params} placeholder={"Options"} />
							)}
							onChange={(_, value) => {
								setOptionsValue(value);
							}}
							freeSolo
						/>
					)}
					<CardActions>
						<Button
							variant="contained"
							onClick={onAddClicked}
							size="small"
							className={style.saveButton}
						>
							Save
						</Button>
					</CardActions>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader
				title={title}
				subheader={input?.description}
				subheaderTypographyProps={{
					fontSize: 12,
				}}
				action={
					<IconButton aria-label="Add" onClick={() => setEditInput(title)}>
						<Edit />
					</IconButton>
				}
			/>
			<CardContent className={style.cardContent}>
				{input?.required && <p>Required</p>}
				{input?.default && <p>Default: {input.default}</p>}
				{input?.type && <p>Type: {input.type}</p>}
				{input?.options && <p>Options: {input.options.join(", ")}</p>}
			</CardContent>
		</Card>
	);
};
