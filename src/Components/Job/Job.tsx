import { Dispatch, SetStateAction, useContext } from "react";
import { Settings as SettingsIcon } from "react-feather";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Collapse from "@mui/material/Collapse";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";

import { Handle, Position } from "@xyflow/react";
import { WorkflowContext } from "../../Contexts/WorkflowContext";
import { OpenJobSettingsState, OpenStepSettingsState } from "../../types";
import { NormalJob } from "../../types/workflowTypes";
import { cn, useNeedsConnections } from "../../utils";
import { Steps } from "../Step/Steps";
import { ExpandMore } from "../UI/Expand";
import style from "./Job.module.scss";

interface JobProps {
	data: {
		jobId: string;
		job: NormalJob;
		isOpenJobSettings: boolean;
		isOpenSteps: boolean;
		setOpenJobSettings: Dispatch<
			SetStateAction<OpenJobSettingsState | undefined>
		>;
		setOpenSteps: Dispatch<SetStateAction<OpenJobSettingsState | undefined>>;
		setOpenStepSettings: Dispatch<
			SetStateAction<OpenStepSettingsState | undefined>
		>;
	};
}

export const Job = (props: JobProps) => {
	const {
		jobId,
		job,
		isOpenJobSettings,
		isOpenSteps,
		setOpenJobSettings,
		setOpenStepSettings,
		setOpenSteps,
	} = props.data;

	const { workflow } = useContext(WorkflowContext);

	const { value, id } = useNeedsConnections(workflow, jobId);

	return (
		<>
			<Handle
				type="target"
				position={Position.Left}
				className={cn(style.endConnector)}
			/>
			<div className={style.endShadow}></div>

			<Grow
				in={true}
				style={{
					transformOrigin: "0 0 0",
					visibility: "visible",
				}}
				timeout={300}
			>
				<Card
					className={style.jobContainer}
					key={jobId}
					style={{ gridColumn: value + 1, gridRow: id ? 1 : "auto" }}
					onClick={(e) => {
						e.stopPropagation();
						setOpenSteps(isOpenSteps ? undefined : { job: job, id: jobId });
					}}
				>
					<CardActionArea
						sx={{
							padding: 1,
						}}
					>
						<div className={style.header}>
							<IconButton
								edge="start"
								aria-label="settings"
								title="Settings"
								onClick={(e) => {
									e.stopPropagation();
									setOpenJobSettings(
										isOpenJobSettings ? undefined : { job: job, id: jobId },
									);

									setOpenStepSettings(undefined);
								}}
								sx={{
									marginLeft: "0px",
									marginRight: 1,
								}}
							>
								<SettingsIcon
									className={cn(
										style.settingButton,
										isOpenJobSettings && style.openSettings,
									)}
								/>
							</IconButton>

							<span className={style.jobName}>{job.name}</span>
							<div className={style.spacer}></div>

							<ExpandMore
								expand={isOpenSteps}
								onClick={(e) => {
									e.stopPropagation();
									setOpenSteps(
										isOpenSteps ? undefined : { job: job, id: jobId },
									);
								}}
								aria-expanded={isOpenSteps}
								aria-label="show more"
								className={style.expand}
							>
								<ExpandMoreIcon />
							</ExpandMore>
						</div>
					</CardActionArea>
					<Collapse in={isOpenSteps} timeout="auto" unmountOnExit>
						<Steps
							job={job}
							id={jobId}
							setOpenStepSettings={setOpenStepSettings}
						/>
					</Collapse>
				</Card>
			</Grow>
			<Handle
				type="source"
				position={Position.Right}
				className={cn(style.startConnector)}
			/>
			<div className={style.startShadow}></div>
		</>
	);
};
