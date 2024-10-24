import {
	List,
	ListItem,
	ListItemButton,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import { useContext, useState } from "react";
import { WorkflowContext } from "../../Contexts/WorkflowContext";
import { Workflow } from "../../types/workflowTypes";
import { BaseSetting } from "../Settings/BaseSetting";
import { ConcurrencySetting } from "../Settings/ConcurrencySetting";
import { DefaultsSetting } from "../Settings/DefaultsSetting";
import { NameSetting } from "../Settings/NameSetting";
import { ObjectSetting } from "../Settings/ObjectSetting";
import { OnSetting } from "../Settings/OnSetting/OnSetting";
import { PermissionsSetting } from "../Settings/PermissionsSetting";
import { StringSetting } from "../Settings/StringSetting";
import { SideBarLabel } from "../UI/SideBarLabel/SideBarLabel";
import YamlEditor from "../UI/YAMLEditor";
import style from "./Workflow.module.scss";

interface WorkflowSettingsProps {
	onClose: () => void;
}

export const WorkflowSettings = ({ onClose }: WorkflowSettingsProps) => {
	const { workflow, setWorkflow, setWorkflowChanged } =
		useContext(WorkflowContext);
	const [settingType, setSettingType] = useState("run-name");
	const [yamlEditor, setYamlEditor] = useState(false);

	const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>(workflow!);

	if (!workflow) {
		return <></>;
	}

	const onClick = () => {
		const newWorkflow = {
			...workflow,
			...currentWorkflow,
		};

		setWorkflow?.(newWorkflow);

		setWorkflowChanged?.((prev) => [
			...prev,
			{
				change: newWorkflow,
				message: `Workflow successfully updated`,
			},
		]);
	};

	const updateWorkflow = (key: keyof Workflow, value: any) => {
		// If no value, or value is an empty object or an empty string, remove the key from the object
		if (!value || (typeof value === "object" && !Object.keys(value).length)) {
			const newValue = { ...currentWorkflow };
			delete newValue[key];
			setCurrentWorkflow(newValue);
			return;
		}

		setCurrentWorkflow((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const runNameSettings = [
		{
			id: "run-name",
			name: "Run name",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Run name"
					settingDetails='The name for workflow runs generated from the workflow. GitHub displays the workflow run name in the list of workflow runs on your repositorys "Actions" tab. If run-name is omitted or is only whitespace, then the run name is set to event-specific information for the workflow run.'
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<StringSetting
						value={currentWorkflow["run-name"]}
						name="Run name"
						onChange={(value) => updateWorkflow("run-name", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const onSettings = [
		{
			id: "on",
			name: "On",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="New Events"
					settingDetails="To automatically trigger a workflow, use on to define which events can cause the workflow to run"
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<OnSetting
						value={currentWorkflow["on"]}
						onChange={(value) => updateWorkflow("on", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const permissionSettings = [
		{
			id: "permissions",
			name: "Permissions",
			render: (hide: boolean) => (
				<BaseSetting style={{ display: hide ? "inline-table" : "none" }}>
					<PermissionsSetting
						value={currentWorkflow.permissions}
						onChange={(value) => updateWorkflow("permissions", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const defaultsSettings = [
		{
			id: "defaults",
			name: "Defaults",
			render: (hide: boolean) => (
				<BaseSetting style={{ display: hide ? "inline-table" : "none" }}>
					<DefaultsSetting
						value={currentWorkflow.defaults}
						name="Defaults"
						onChange={(value) => updateWorkflow("defaults", value)}
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
					settingDetails="A map of variables that are available to all steps in the job. You can set variables for the entire workflow or an individual step. For more information, see env and jobs.<job_id>.steps[*].env."
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ObjectSetting
						value={currentWorkflow.env}
						name="Env"
						onChange={(value) => updateWorkflow("env", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const concurrencySettings = [
		{
			id: "concurrency",
			name: "Concurrency",
			render: (hide: boolean) => (
				<BaseSetting
					settingName="Concurrency"
					settingDetails='Used to ensure that only a single job or workflow using the same concurrency group will run at a time. Allowed expression contexts: github, inputs, vars, needs, strategy, and matrix. For more information about expressions, see "Expressions."'
					style={{ display: hide ? "inline-table" : "none" }}
				>
					<ConcurrencySetting
						value={currentWorkflow["concurrency"]}
						onChange={(value) => updateWorkflow("concurrency", value)}
					/>
				</BaseSetting>
			),
		},
	];

	const allSettings = [
		...runNameSettings,
		...onSettings,
		...permissionSettings,
		...envSettings,
		...defaultsSettings,
		...concurrencySettings,
	];

	const { jobs: _, ...currentWorkflowWithoutJobs } = currentWorkflow;

	return (
		<div className={style.container}>
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
							onClick={() => setSettingType("run-name")}
							selected={settingType === "run-name"}
						>
							<SideBarLabel
								primary="Run name"
								hasValue={!!currentWorkflow["run-name"]}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("on")}
							selected={settingType === "on"}
						>
							<SideBarLabel
								primary="On"
								hasValue={
									!!currentWorkflow["on"] &&
									!!Object.keys(currentWorkflow["on"]).length
								}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("permissions")}
							selected={settingType === "permissions"}
						>
							<SideBarLabel
								primary="Permissions"
								hasValue={
									!!currentWorkflow["permissions"] &&
									!!Object.keys(currentWorkflow["permissions"]).length
								}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("env")}
							selected={settingType === "env"}
						>
							<SideBarLabel
								primary="Env"
								hasValue={
									!!currentWorkflow["env"] &&
									!!Object.keys(currentWorkflow["env"]).length
								}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("concurrency")}
							selected={settingType === "concurrency"}
						>
							<SideBarLabel
								primary="Concurrency"
								hasValue={
									!!currentWorkflow["concurrency"] &&
									!!Object.keys(currentWorkflow["concurrency"]).length
								}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem disablePadding>
						<ListItemButton
							onClick={() => setSettingType("defaults")}
							selected={settingType === "defaults"}
						>
							<SideBarLabel
								primary="Defaults"
								hasValue={
									!!currentWorkflow["defaults"] &&
									!!Object.keys(currentWorkflow["defaults"]).length
								}
							/>
						</ListItemButton>
					</ListItem>
				</List>
			</div>
			<div className={style.main}>
				<div className={style.header}>
					<NameSetting
						value={currentWorkflow.name}
						onChange={(value) => updateWorkflow("name", value)}
					/>
				</div>
				<div className={style.settingsContainer}>
					{yamlEditor ? (
						<YamlEditor
							word={settingType}
							value={currentWorkflowWithoutJobs as Workflow}
							onChange={(value: any) =>
								setCurrentWorkflow({ ...value, jobs: workflow.jobs })
							}
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
