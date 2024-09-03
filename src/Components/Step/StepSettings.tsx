import { DeleteForever } from "@mui/icons-material";
import {
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { useContext, useState } from "react";
import { vscode } from "../../App";
import { WorkflowContext } from "../../Contexts/WorkflowContext";
import { Step } from "../../types/workflowTypes";
import { getCurrentStep } from "../../utils";
import { BaseSetting } from "../Settings/BaseSetting";
import { BooleanSetting } from "../Settings/BooleanSetting";
import { NameSetting } from "../Settings/NameSetting";
import { NumberSetting } from "../Settings/NumberSetting";
import { ObjectSetting } from "../Settings/ObjectSetting";
import { StringSetting } from "../Settings/StringSetting";
import YamlEditor from "../UI/YAMLEditor";
import style from "./Steps.module.scss";

interface StepSettingsProps {
	step: Step;
	id: string | undefined;
	jobId: string;
	onClose: () => void;
}

export const StepSettings = ({
	step,
	id,
	jobId,
	onClose,
}: StepSettingsProps) => {
	const [settingType, setSettingType] = useState("basic");
	const [currentStep, setCurrentStep] = useState(step);
	const [yamlEditor, setYamlEditor] = useState(false);

	const { workflow, setWorkflow, setWorkflowChanged } =
		useContext(WorkflowContext);

	if (!step || !id || !jobId) {
		return <></>;
	}

	const onClick = () => {
		if (!workflow) {
			return;
		}

		const newWorkflow = {
			...workflow,
			jobs: {
				...workflow.jobs,
				[jobId]: {
					...workflow.jobs[jobId],
					steps: workflow.jobs[jobId].steps?.map((step) => {
						if (getCurrentStep(step, id)) {
							return currentStep;
						}
						return step;
					}),
				},
			},
		};

		setWorkflow?.(newWorkflow);

		setWorkflowChanged?.((prev) => {
			return [
				...prev,
				{
					change: newWorkflow,
					message: `${step.name} successfully updated`,
				},
			];
		});
	};

	const removeStep = () => {
		setWorkflow?.((prev) => {
			if (!prev) {
				return;
			}

			const currentJob = prev.jobs[jobId];

			const remainingSteps = currentJob.steps?.filter((step) => {
				return (
					step.id !== id &&
					step.name !== id &&
					step.run !== id &&
					step.uses !== id
				);
			});

			const newWorkflow = {
				...prev,
				jobs: {
					...prev.jobs,
					[jobId]: {
						...currentJob,
						steps: remainingSteps,
					},
				},
			};

			setWorkflowChanged?.((prev) => [
				...prev,
				{
					change: newWorkflow,
					message: `Successfully removed step`,
				},
			]);

			return newWorkflow;
		});

		onClose();
	};

	const updateCurrentStep = (key: string, value: any) => {
		setCurrentStep((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const basicSettings = [
		{
			id: "basic",
			name: "id",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="id"
					settingDetails='A unique identifier for the step. You can use the id to reference the step in contexts. For more information, see "Contexts."'
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentStep["id"]}
						name="id"
						onChange={(value) => updateCurrentStep("id", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "If",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="If"
					settingDetails='Prevents a step from running unless a condition is met. You can use any supported context and expression to create a conditional. For more information on which contexts are supported in this key, see "Contexts."'
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentStep["if"]}
						name="If"
						onChange={(value) => updateCurrentStep("if", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Run",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Run"
					settingDetails="Runs command-line programs that do not exceed 21,000 characters using the operating systems shell. If you do not provide a name, the step name will default to the text specified in the run command."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentStep["run"]}
						name="Run"
						multiline
						onChange={(value) => updateCurrentStep("run", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Timeout",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Timeout"
					settingDetails="The maximum number of minutes to let a step run before GitHub automatically cancels it. Default: 360"
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<NumberSetting
						value={currentStep["timeout-minutes"]}
						onChange={(value) => updateCurrentStep("timeout-minutes", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Uses",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Uses"
					settingDetails="Selects an action to run as part of a step in your job. An action is a reusable unit of code. You can use an action defined in the same repository as the workflow, a public repository, or in a published Docker container image."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentStep.uses}
						name="Uses"
						onChange={(value) => updateCurrentStep("uses", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Shell",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Shell"
					settingDetails="You can override the default shell settings in the runner's operating system and the job's default using the shell keyword."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentStep.shell}
						name="Shell"
						onChange={(value) => updateCurrentStep("shell", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Working directory",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Working directory"
					settingDetails="Specify the working directory of where to run the command."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentStep["working-directory"]}
						name="Working directory"
						onChange={(value) => updateCurrentStep("working-directory", value)}
					/>
				</BaseSetting>
			),
		},
		{
			id: "basic",
			name: "Continue on error",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Continue on error"
					settingDetails="Prevents a job from failing when a step fails. Set to true to allow a job to pass when this step fails."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<BooleanSetting
						value={currentStep["continue-on-error"]}
						onChange={(value) => updateCurrentStep("continue-on-error", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const withSettings = [
		{
			id: "with",
			name: "With",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="With"
					settingDetails="A map of the input parameters defined by the action. Each input parameter is a key/value pair. Input parameters are set as environment variables. The variable is prefixed with INPUT_ and converted to upper case."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ObjectSetting
						value={currentStep["with"]}
						name="With"
						onChange={(value) => updateCurrentStep("with", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const envSettings = [
		{
			id: "env",
			name: "Env",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Env"
					settingDetails="Sets variables for steps to use in the runner environment"
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ObjectSetting
						value={currentStep["env"]}
						name="Env"
						onChange={(value) => updateCurrentStep("env", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const allSettings = [...basicSettings, ...withSettings, ...envSettings];

	return (
		<div className={style.container} key={id}>
			<div className={style.sidebar}>
				<ToggleButtonGroup
					color="primary"
					value={yamlEditor ? "android" : "web"}
					exclusive
					onChange={(_, value) => setYamlEditor(value === "android")}
					aria-label="Platform"
					fullWidth
				>
					<ToggleButton value="web">UI</ToggleButton>
					<ToggleButton value="android">YAML</ToggleButton>
				</ToggleButtonGroup>
				<List>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("basic")}
							selected={settingType === "basic"}
						>
							<ListItemText primary="Basic" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("with")}
							selected={settingType === "with"}
						>
							<ListItemText primary="With" />
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("env")}
							selected={settingType === "env"}
						>
							<ListItemText primary="Env" />
						</ListItemButton>
					</ListItem>
				</List>
			</div>
			<div className={style.main}>
				<div className={style.header}>
					<NameSetting
						value={currentStep.name}
						onChange={(value) => updateCurrentStep("name", value)}
					/>
					<IconButton
						edge="start"
						aria-label="settings"
						title="Delete"
						onClick={(e) => {
							if (vscode) {
								vscode.postMessage({
									action: "deleteStep",
									jobId,
									id,
								});
							} else {
								const response = window.confirm(
									"Are you sure you want to remove this step?",
								);
								if (response) {
									removeStep();
								}
							}
						}}
						sx={{
							marginLeft: "0px",
							marginRight: 1,
							marginTop: 1,
							marginBottom: 1,
						}}
					>
						<DeleteForever />
					</IconButton>
				</div>
				<div className={style.settingsContainer}>
					{yamlEditor ? (
						<YamlEditor
							word={settingType}
							value={currentStep}
							onChange={setCurrentStep}
						/>
					) : (
						allSettings.map((setting) =>
							setting?.render(settingType === setting.id),
						)
					)}
				</div>
				<button className={style.saveButton} onClick={onClick}>
					Save
				</button>
			</div>
		</div>
	);
};
