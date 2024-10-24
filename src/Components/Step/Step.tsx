import { IconButton } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { Settings } from "react-feather";
import { OpenStepSettingsState } from "../../types";
import { Step as StepType } from "../../types/workflowTypes";
import style from "./Steps.module.scss";

interface StepProps {
	step: StepType;
	id: string;
	setOpenStepSettings: Dispatch<
		SetStateAction<OpenStepSettingsState | undefined>
	>;
}

export const Step = ({ step, id, setOpenStepSettings }: StepProps) => {
	const stepId = step.id || step.name || step.run || step.uses;

	const onClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

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
