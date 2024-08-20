import { IconButton } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Settings } from "react-feather";
import { OpenJobSettingsState, OpenStepSettingsState } from "../../types";
import { Step as StepType } from "../../types/workflowTypes";
import style from "./Steps.module.scss";

interface StepProps {
	step: StepType;
	id: string;
	setOpenStepSettings: Dispatch<
		SetStateAction<OpenStepSettingsState | undefined>
	>;
	setOpenSettings: Dispatch<SetStateAction<OpenJobSettingsState | undefined>>;
}

export const Step = ({
	step,
	id,
	setOpenStepSettings,
	setOpenSettings,
}: StepProps) => {
	const stepId = step.id || step.name || step.run || step.uses;

	const onClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		setOpenSettings(undefined);

		setOpenStepSettings({
			step: step,
			jobId: id,
			stepId,
		});
	};

	return (
		<div className={style.step} key={stepId}>
			<span className={style.name}>{stepId}</span>

			<IconButton
				edge="start"
				aria-label="settings"
				title="Settings"
				onClick={onClick}
			>
				<Settings className={style.settingButton} />
			</IconButton>
		</div>
	);
};
