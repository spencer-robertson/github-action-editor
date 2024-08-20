import { Button } from "@mui/material";
import { Dispatch, SetStateAction, useContext } from "react";
import {
	DragDropContext,
	Draggable,
	DraggingStyle,
	Droppable,
	DropResult,
	NotDraggingStyle,
} from "react-beautiful-dnd";
import { WorkflowContext } from "../../Contexts/WorkflowContext";
import { OpenJobSettingsState, OpenStepSettingsState } from "../../types";
import { NormalJob, Step as StepType } from "../../types/workflowTypes";
import { Step } from "./Step";
import style from "./Steps.module.scss";

interface StepsProps {
	job: NormalJob;
	id: string;
	setOpenStepSettings: Dispatch<
		SetStateAction<OpenStepSettingsState | undefined>
	>;
	setOpenSettings: Dispatch<SetStateAction<OpenJobSettingsState | undefined>>;
}

export const Steps = ({
	job,
	id,
	setOpenSettings,
	setOpenStepSettings,
}: StepsProps) => {
	const { setWorkflow, setWorkflowChanged } = useContext(WorkflowContext);

	const addStep = () => {
		setWorkflow?.((prev) => {
			if (!prev) {
				return prev;
			}

			const currentJob = prev.jobs[id];

			const newWorkflow = {
				...prev,
				jobs: {
					...prev.jobs,
					[id]: {
						...currentJob,
						steps: [
							...(currentJob.steps || []),
							{
								name: "New step",
								id: "new-step",
							},
						] as StepType[],
					},
				},
			};

			setWorkflowChanged?.((prev) => [
				...prev,
				{
					change: newWorkflow,
					message: "Successfully added new step",
				},
			]);

			return newWorkflow;
		});
	};

	const moveElement = (
		array: StepType[] | undefined,
		fromIndex: number,
		toIndex: number | undefined,
	) => {
		if (!array || toIndex === undefined) {
			return;
		}

		const element = array[fromIndex];
		array.splice(fromIndex, 1);
		array.splice(toIndex, 0, element);

		return array;
	};

	const onDragEnd = (result: DropResult) => {
		if (result.source && result.destination) {
			if (result.source.index === result.destination?.index) {
				return;
			}

			setWorkflow?.((prev) => {
				if (!prev) {
					return prev;
				}

				const currentJob = prev.jobs[id];

				const steps = moveElement(
					job.steps,
					result.source.index,
					result.destination?.index,
				);

				const newWorkflow = {
					...prev,
					jobs: {
						...prev.jobs,
						[id]: {
							...currentJob,
							steps: steps,
						},
					},
				};

				setWorkflowChanged?.((prev) => {
					return [
						...prev,
						{
							change: newWorkflow,
							message: "Successfully reordered steps",
						},
					];
				});

				return newWorkflow;
			});
		}
	};

	const getItemStyle = (
		isDragging: boolean,
		draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
	) => {
		return {
			...draggableStyle,
			userSelect: "none",
			position: "static",
			// padding: isDragging ? 10 : 0,
			margin: isDragging ? `0 0 -2em 0` : `0 0 5px 0`,
			backgroundColor: isDragging ? "rgb(211, 211, 211, 0.3)" : undefined,
			borderRadius: "5px",
		};
	};

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			onMouseDown={(e) => {
				e.stopPropagation();
				e.preventDefault();
			}}
			className={style.stepsContainer}
		>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<div {...provided.droppableProps} ref={provided.innerRef}>
							{job.steps?.map((step, index) => {
								const stepId = step.id || step.name || step.run || step.uses;

								return (
									<Draggable
										key={stepId}
										draggableId={stepId || ""}
										index={index}
									>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={
													getItemStyle(
														snapshot.isDragging,
														provided.draggableProps.style,
													) as React.CSSProperties
												}
											>
												<Step
													step={step}
													id={id}
													setOpenSettings={setOpenSettings}
													setOpenStepSettings={setOpenStepSettings}
												/>
											</div>
										)}
									</Draggable>
								);
							})}
							{provided.placeholder}
						</div>
					)}
				</Droppable>

				<Button
					className={style.addStepButton}
					onClick={addStep}
					variant="contained"
				>
					Add step
				</Button>
			</DragDropContext>
		</div>
	);
};
