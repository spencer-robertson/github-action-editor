import { DeleteForever } from "@mui/icons-material";
import {
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from "@mui/material";
import * as R from "ramda";
import { useContext, useRef, useState } from "react";
import { WorkflowContext } from "../../Contexts/WorkflowContext";
import { SettingsRef } from "../../types";
import { Step } from "../../types/workflowTypes";
import { getCurrentStep } from "../../utils";
import { BaseSetting } from "../Settings/BaseSetting";
import { BooleanSetting } from "../Settings/BooleanSetting";
import { NameSetting } from "../Settings/NameSetting";
import { NumberSetting } from "../Settings/NumberSetting";
import { ObjectSetting } from "../Settings/ObjectSetting";
import { StringSetting } from "../Settings/StringSetting";
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

	const nameRef = useRef<SettingsRef>(null);
	const idRef = useRef<SettingsRef>(null);
	const ifRef = useRef<SettingsRef>(null);
	const usesRef = useRef<SettingsRef>(null);
	const runRef = useRef<SettingsRef>(null);
	const shellRef = useRef<SettingsRef>(null);
	const withRef = useRef<SettingsRef>(null);
	const envRef = useRef<SettingsRef>(null);
	const continueOnErrorRef = useRef<SettingsRef>(null);
	const workingDirectoryRef = useRef<SettingsRef>(null);
	const timeoutRef = useRef<SettingsRef>(null);

	const { workflow, setWorkflow, setWorkflowChanged } =
		useContext(WorkflowContext);

	if (!step || !id || !jobId) {
		return <></>;
	}

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
					<StringSetting ref={idRef} value={step["id"]} name="id" />
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
					<StringSetting ref={ifRef} value={step["if"]} name="If" />
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
					<NumberSetting ref={timeoutRef} value={step["timeout-minutes"]} />
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
					<StringSetting ref={usesRef} value={step.uses} name="Uses" />
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
					<StringSetting ref={shellRef} value={step.shell} name="Shell" />
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
						ref={workingDirectoryRef}
						value={step["working-directory"]}
						name="Working directory"
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
						ref={continueOnErrorRef}
						value={step["continue-on-error"]}
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
					<ObjectSetting ref={withRef} value={step["with"]} name="With" />
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
					<ObjectSetting ref={envRef} value={step["env"]} name="Env" />
				</BaseSetting>
			),
		},
	];

	const onClick = () => {
		if (!workflow) {
			return;
		}

		const nameSetting = nameRef.current?.getValue();
		const idSetting = idRef.current?.getValue();
		const ifSetting = ifRef.current?.getValue();
		const usesSetting = usesRef.current?.getValue();
		const runSetting = runRef.current?.getValue();
		const shellSetting = shellRef.current?.getValue();
		const withSetting = withRef.current?.getValue();
		const envSetting = envRef.current?.getValue();
		const continueOnErrorSetting = continueOnErrorRef.current?.getValue();
		const workingDirectorySetting = workingDirectoryRef.current?.getValue();
		const timeoutSetting = timeoutRef.current?.getValue();

		const newWorkflow = R.clone(workflow);

		const currentJob = newWorkflow.jobs[jobId];

		const currentStep = currentJob.steps?.findIndex((step) => {
			return getCurrentStep(step, id);
		});

		if (currentStep === undefined || !newWorkflow.jobs[jobId]?.steps) {
			return;
		}

		const change = {
			...workflow.jobs[jobId].steps?.[currentStep],
			name: nameSetting,
			id: idSetting,
			if: ifSetting,
			uses: usesSetting,
			run: runSetting,
			shell: shellSetting,
			with: withSetting,
			env: envSetting,
			"working-directory": workingDirectorySetting,
			"continue-on-error": continueOnErrorSetting,
			"timeout-minutes": timeoutSetting,
		};

		(newWorkflow.jobs[jobId].steps as Step[])[currentStep] = change;

		setWorkflow?.(newWorkflow);

		setWorkflowChanged?.((prev) => {
			return [
				...prev,
				{
					change: newWorkflow,
					message: `${nameSetting} successfully updated`,
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

	const allSettings = [...basicSettings, ...withSettings, ...envSettings];

	return (
		<div className={style.container} key={id}>
			<div className={style.sidebar}>
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
					<NameSetting ref={nameRef} value={step.name} />
					<IconButton
						edge="start"
						aria-label="settings"
						title="Delete"
						onClick={(e) => {
							const response = window.confirm(
								"Are you sure you want to remove this step?",
							);
							if (response) {
								removeStep();
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
					{allSettings.map((setting) =>
						setting?.render(settingType === setting.id),
					)}
				</div>
				<button className={style.saveButton} onClick={onClick}>
					Save
				</button>
			</div>
		</div>
	);
};
