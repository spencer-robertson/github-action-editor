import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useEffect, useMemo, useState } from "react";
import YAML from "yaml";

import { Alert, Box, Button, Modal, Snackbar } from "@mui/material";
import {
	Connection,
	Controls,
	Edge,
	EdgeChange,
	Node,
	ReactFlow,
	useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Uri } from "vscode";
import style from "./App.module.scss";
import { Job } from "./Components/Job/Job";
import { JobSettings } from "./Components/Job/JobSettings";
import { StepSettings } from "./Components/Step/StepSettings";
import { CustomEdge } from "./Components/UI/CustomEdge";
import { WorkflowContext } from "./Contexts/WorkflowContext";
import { setTheme } from "./Theme";
import workflowFile from "./mockData/workflow.yml";
import { OpenJobSettingsState } from "./types";
import { Step, Workflow } from "./types/workflowTypes";
import { findIdsByValue, useNeedsConnections } from "./utils";

// eslint-disable-next-line no-new-func
const acquireVsCodeApi = Function(`
	if (typeof acquireVsCodeApi === "function") {
		return acquireVsCodeApi();
	} else {
		return undefined;
	}
`);

const vscode = acquireVsCodeApi();

function App() {
	const [openSettings, setOpenSettings] = useState<
		OpenJobSettingsState | undefined
	>(undefined);

	const [openSteps, setOpenSteps] = useState<OpenJobSettingsState | undefined>(
		undefined,
	);

	const [openStepSettings, setOpenStepSettings] = useState<
		| {
				step: Step;
				jobId: string;
				stepId: string | undefined;
		  }
		| undefined
	>(undefined);

	const [workflow, setWorkflow] = useState<Workflow | undefined>(undefined);

	const [workflowChanged, setWorkflowChanged] = useState<
		{
			change: Workflow;
			message: string;
		}[]
	>([]);

	const [saved, setSaved] = useState(false);

	const [fileUri, setFileUri] = useState<Uri | undefined>(undefined);

	const { deepestRoutes, needsObj } = useNeedsConnections(workflow);

	const maxDepth = deepestRoutes ? Math.max(...deepestRoutes?.values()) + 1 : 1;

	let initialEdges: Edge[] = [];

	Object.entries(needsObj || {}).forEach(([id, needs]) => {
		for (const need of needs) {
			initialEdges.push({
				id: `${id}-${need}`,
				source: `${need}`,
				target: `${id}`,
				type: "custom-edge",
			});
		}
	});

	useEffect(() => {
		fetch(workflowFile)
			.then((file) => file.text())
			.then((text) => {
				setWorkflow(YAML.parse(text));
				setWorkflowChanged([
					{
						change: YAML.parse(text),
						message: "Workflow successfully loaded",
					},
				]);
			});
	}, []);

	useEffect(() => {
		if (workflowChanged) {
			setSaved(true);
		}
	}, [workflowChanged]);

	useEffect(() => {
		setTheme(
			document.body.classList.contains("vscode-dark") ||
				document.body.classList.contains("vscode-high-contrast"),
			undefined,
		);

		if (deepestRoutes) {
			const root = document.documentElement;
			root?.style.setProperty("--columns", maxDepth.toString());
		}
	}, [workflow, deepestRoutes, maxDepth]);

	useEffect(() => {
		window.addEventListener("message", windowMessageListener);
		return () => {
			window.removeEventListener("message", windowMessageListener);
		};
	}, []);

	const [edges, setEdges] = useEdgesState(initialEdges);

	useEffect(() => {
		setEdges(initialEdges);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(initialEdges)]);

	const saveWorkflow = () => {
		const workflowString = YAML.stringify(workflow);
		navigator.clipboard.writeText(workflowString);

		if (fileUri && vscode) {
			vscode.postMessage({
				action: "save",
				data: {
					fileUri: fileUri.fsPath,
					workflow: workflowString,
				},
			});

			if (workflow) {
				setWorkflowChanged((prev) => [
					...prev,
					{
						change: workflow,
						message: "Workflow successfully saved",
					},
				]);
			}
		}
	};

	const addJob = () => {
		setWorkflow((prev) => {
			if (!prev) {
				return;
			}

			return {
				...prev,
				jobs: {
					...prev.jobs,
					["new-job-" + ("" + Math.random()).substring(2, 10)]: {
						steps: [],
						"runs-on": "ubuntu-latest",
					},
				},
			};
		});
	};

	const nodeTypes = useMemo(() => ({ job: Job }), []);
	const edgeTypes = {
		"custom-edge": CustomEdge,
	};

	const neededObj = Object.values(needsObj || {}).flat();

	let initialColumnHeight = 0;

	const neededNodes: Node[] = Array.from({ length: maxDepth })
		.map((_, index) => {
			const inThisLevel = findIdsByValue(deepestRoutes, index);

			const jobs = Object.entries(workflow?.jobs || {}).filter(([id]) => {
				return inThisLevel.includes(id);
			});

			let possibleOpenSteps = 0;

			const neededJobs = jobs.filter(([id]) => {
				const endConnector = needsObj?.[id];
				const startConnector = neededObj.includes(id);
				return endConnector || startConnector;
			});

			return neededJobs
				.filter(([id]) => {
					const endConnector = needsObj?.[id];
					const startConnector = neededObj.includes(id);
					if (!endConnector && !startConnector) {
						return false;
					}

					return true;
				})
				.map(([id, job], jobIndex) => {
					const isOpenSettings = openSettings?.id === id;
					const isOpenSteps = openSteps?.id === id;

					const stepLength = job.steps?.length || 0;
					const xPos = 25 + 400 * index;
					const yPos = 100 * jobIndex + possibleOpenSteps;

					if (isOpenSteps) {
						possibleOpenSteps = stepLength * 41 + 60;
					}

					if (index === 0) {
						initialColumnHeight = 100 * jobIndex + possibleOpenSteps;
					}

					return {
						id: `${id}`,
						type: "job",
						position: {
							x: xPos,
							y: yPos,
						},
						data: {
							job,
							jobId: id,
							setOpenSettings,
							isOpenSettings,
							setOpenSteps,
							isOpenSteps,
							setOpenStepSettings,
						},
					};
				})
				.filter((node) => node !== undefined);
		})
		.flat();

	const unNeededJobs = Object.entries(workflow?.jobs || {}).filter(([id]) => {
		const endConnector = needsObj?.[id];
		const startConnector = neededObj.includes(id);
		return !endConnector && !startConnector;
	});

	let possibleOpenSteps = 0;
	const unNeededNodes: Node[] = unNeededJobs
		.map(([id, job], jobIndex) => {
			const isOpenSettings = openSettings?.id === id;
			const isOpenSteps = openSteps?.id === id;

			const stepLength = job.steps?.length || 0;
			const yPos = 100 * jobIndex + possibleOpenSteps;

			if (isOpenSteps) {
				possibleOpenSteps = stepLength * 41 + 60;
			}

			return {
				id: `${id}`,
				type: "job",
				position: {
					x: 25,
					y: yPos + 25,
				},
				parentId: "2",
				data: {
					job,
					jobId: id,
					setOpenSettings,
					isOpenSettings,
					setOpenSteps,
					isOpenSteps,
					setOpenStepSettings,
				},
			};
		})
		.flat();

	if (unNeededNodes.length && neededNodes.length) {
		unNeededNodes.unshift({
			id: "2",
			data: { label: "Group A" },
			position: { x: 0, y: initialColumnHeight + 100 },
			className: style.unNeededContainer,
			style: {
				height: unNeededJobs.length * 100 + possibleOpenSteps,
			},
			type: "group",
		});
	}

	const windowMessageListener = (event: MessageEvent) => {
		if (vscode && event.data.template && event.data.fileUri) {
			setWorkflow(YAML.parse(event.data.template));
			setWorkflowChanged([
				{
					change: YAML.parse(event.data.template),
					message: "Workflow successfully loaded",
				},
			]);
			setFileUri(event.data.fileUri);
		}
	};

	if (!workflow) {
		return <div>Loading...</div>;
	}

	const boxStyle = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "80%",
		height: "80%",
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	const onConnect = ({ source, target }: Connection) => {
		setWorkflow((prev) => {
			if (!prev) {
				return prev;
			}

			const targetJob = prev.jobs[target];

			const previousNeeds = Array.isArray(targetJob.needs)
				? targetJob.needs
				: targetJob.needs
				? [targetJob.needs]
				: [];

			if (previousNeeds.includes(source)) {
				return prev;
			}

			const newWorkflow = {
				...prev,
				jobs: {
					...prev.jobs,
					[target]: {
						...targetJob,
						needs: [...previousNeeds, source],
					},
				},
			};

			setWorkflowChanged((prev) => [
				...prev,
				{
					change: newWorkflow,
					message: `Successfully updated ${targetJob.name}`,
				},
			]);

			return newWorkflow;
		});
	};

	const onDisconnect = (disconnectedEdges: EdgeChange<Edge>[]) => {
		const disconnectedEdge = disconnectedEdges[0];
		if (disconnectedEdge.type !== "remove") {
			return;
		}

		const edge = edges.find(({ id }) => disconnectedEdge.id === id);

		if (!edge) {
			return;
		}

		setEdges((es) => es.filter((e) => e.id !== disconnectedEdge.id));

		setWorkflow((prev) => {
			if (!prev) {
				return prev;
			}

			const targetJob = prev.jobs[edge.target];

			const previousNeeds = Array.isArray(targetJob.needs)
				? targetJob.needs
				: targetJob.needs
				? [targetJob.needs]
				: [];

			if (!previousNeeds.includes(edge.source)) {
				return prev;
			}

			const removedNeeds = previousNeeds.filter((need) => need !== edge.source);

			const newWorkflow = {
				...prev,
				jobs: {
					...prev.jobs,
					[edge.target]: {
						...targetJob,
						needs: removedNeeds,
					},
				},
			};

			setWorkflowChanged((prev) => [
				...prev,
				{
					change: newWorkflow,
					message: `Successfully updated ${targetJob.name}`,
				},
			]);

			return newWorkflow;
		});
	};

	const nodes = [...neededNodes, ...unNeededNodes];

	return (
		<div style={{ height: "100vh" }}>
			<Snackbar
				open={saved}
				onClose={() => setSaved(false)}
				key={"saved"}
				autoHideDuration={1200}
			>
				<Alert
					onClose={() => setSaved(false)}
					severity="success"
					variant="filled"
					className={style.snack}
				>
					{workflowChanged.at(-1)?.message}
				</Alert>
			</Snackbar>

			<div className={style.header}>
				<div className={style.title}>{workflow.name}</div>
				<div className={style.actions}>
					<Button variant="outlined" onClick={addJob} size="large">
						Add job
					</Button>
					<Button
						variant="contained"
						onClick={saveWorkflow}
						size="large"
						className={style.saveButton}
					>
						Save workflow
					</Button>
				</div>
			</div>

			<WorkflowContext.Provider
				value={{ workflow, setWorkflow, workflowChanged, setWorkflowChanged }}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onConnect={onConnect}
					onEdgesChange={onDisconnect}
					fitView
				>
					<Controls showInteractive={false} />
				</ReactFlow>
				<Modal
					open={!!openSettings || !!openStepSettings}
					onClose={() => {
						setOpenSettings(undefined);
						setOpenStepSettings(undefined);
					}}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={boxStyle} className={style.modal}>
						{openSettings && (
							<JobSettings
								job={openSettings?.job}
								id={openSettings?.id}
								onClose={() => setOpenSettings(undefined)}
							/>
						)}
						{openStepSettings && (
							<StepSettings
								step={openStepSettings.step}
								id={openStepSettings.stepId}
								jobId={openStepSettings.jobId}
								onClose={() => setOpenStepSettings(undefined)}
							/>
						)}
					</Box>
				</Modal>
			</WorkflowContext.Provider>
		</div>
	);
}

export default App;
