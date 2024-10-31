import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useEffect, useMemo, useState } from "react";
import YAML from "yaml";

import {
	Alert,
	Box,
	Button,
	createTheme,
	IconButton,
	Modal,
	Snackbar,
	ThemeProvider,
} from "@mui/material";
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
import { Settings as SettingsIcon } from "react-feather";
import { Uri } from "vscode";
import style from "./App.module.scss";
import { Job } from "./Components/Job/Job";
import { JobSettings } from "./Components/Job/JobSettings";
import { StepSettings } from "./Components/Step/StepSettings";
import { CustomEdge } from "./Components/UI/CustomEdge";
import { WorkflowSettings } from "./Components/Workflow/WorkflowSettings";
import { WorkflowContext } from "./Contexts/WorkflowContext";
import { setTheme } from "./Theme";
import workflowFile from "./mockData/workflow.yml";
import { OpenJobSettingsState } from "./types";
import { Step, Workflow } from "./types/workflowTypes";
import { cn, findIdsByValue, useNeedsConnections } from "./utils";

// eslint-disable-next-line no-new-func
const acquireVsCodeApi = Function(`
	if (typeof acquireVsCodeApi === "function") {
		return acquireVsCodeApi();
	} else {
		return undefined;
	}
`);

export const vscode = acquireVsCodeApi();

export const App = () => {
	const [openWorkflowSettings, setOpenWorkflowSettings] = useState(false);
	const [openJobSettings, setOpenJobSettings] = useState<
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
	const [vscodeTheme, setVscodeTheme] = useState<"light" | "dark">();

	const theme = createTheme({
		palette: {
			mode: vscodeTheme,
		},
	});

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
		const darkMode = document.body.classList.contains("vscode-dark");
		setTheme(darkMode, undefined);

		setVscodeTheme(darkMode ? "dark" : "light");

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
		} else {
			navigator.clipboard.writeText(workflowString);
			if (workflow) {
				setWorkflowChanged((prev) => [
					...prev,
					{
						change: workflow,
						message: "Workflow successfully copied to clipboard",
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
					const isOpenJobSettings = openJobSettings?.id === id;
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
							setOpenJobSettings,
							isOpenJobSettings,
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
			const isOpenJobSettings = openJobSettings?.id === id;
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
					setOpenJobSettings,
					isOpenJobSettings,
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

	const windowMessageListener = ({ data }: MessageEvent) => {
		if (!vscode) {
			return;
		}

		if (data.action === "open" && data.template && data.fileUri) {
			setWorkflow(YAML.parse(data.template));
			setWorkflowChanged([
				{
					change: YAML.parse(data.template),
					message: "Workflow successfully loaded",
				},
			]);
			setFileUri(data.fileUri);
		}

		if (data.action === "deleteJob") {
			const { id } = data;

			setWorkflow?.((prev) => {
				if (!prev) {
					return prev;
				}

				const { [id]: oldJob, ...rest } = prev.jobs;

				const newWorkflow = {
					...prev,
					jobs: { ...rest },
				};

				setWorkflowChanged?.((prev) => [
					...prev,
					{
						change: newWorkflow,
						message: `${oldJob.name} successfully removed`,
					},
				]);

				return newWorkflow;
			});

			setOpenJobSettings(undefined);
		}

		if (data.action === "deleteStep") {
			const { jobId, id } = data;

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

			setOpenStepSettings(undefined);
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
		<ThemeProvider theme={theme}>
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
						<IconButton
							edge="start"
							aria-label="settings"
							title="Settings"
							onClick={(e) => {
								e.stopPropagation();
								setOpenWorkflowSettings(true);

								setOpenStepSettings(undefined);
							}}
							sx={{
								marginLeft: "0px",
								marginRight: 1,
							}}
						>
							<SettingsIcon className={cn(style.settingButton)} />
						</IconButton>
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
						<Controls showInteractive={false} className={style.controls} />
					</ReactFlow>
					<Modal
						open={
							!!openWorkflowSettings || !!openJobSettings || !!openStepSettings
						}
						onClose={() => {
							setOpenJobSettings(undefined);
							setOpenStepSettings(undefined);
							setOpenWorkflowSettings(false);
						}}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={boxStyle}>
							{openWorkflowSettings && (
								<WorkflowSettings
									onClose={() => setOpenWorkflowSettings(false)}
								/>
							)}
							{openJobSettings && (
								<JobSettings
									job={openJobSettings?.job}
									id={openJobSettings?.id}
									onClose={() => setOpenJobSettings(undefined)}
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
		</ThemeProvider>
	);
};
