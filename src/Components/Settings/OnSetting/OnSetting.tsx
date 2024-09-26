import { AddCircleOutline, Delete, Edit } from "@mui/icons-material";
import {
	Autocomplete,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	IconButton,
	Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import YAML from "yaml";
import { Event, Workflow } from "../../../types/workflowTypes";
import { cn } from "../../../utils";
import { BranchProtectionOptions } from "./BranchProtectionOptions";
import { CheckRunOptions } from "./CheckRunOptions";
import { CheckSuiteOptions } from "./CheckSuiteOptions";
import { DiscussionCommentOptions } from "./DiscussionCommentOptions";
import { DiscussionOptions } from "./DiscussionOptions";
import { IssueCommentOptions } from "./IssueCommentOptions";
import { IssueOptions } from "./IssueOptions";
import { LabelOptions } from "./LabelOptions";
import { MergeGroupOptions } from "./MergeGroupOptions";
import { MileStoneOptions } from "./MileStoneOptions";
import style from "./OnSetting.module.scss";
import { ProjectCardOptions } from "./ProjectCardOptions";
import { ProjectColumnOptions } from "./ProjectColumnOptions";
import { ProjectOptions } from "./ProjectOptions";
import { PullRequestOptions } from "./PullRequestOptions";
import { PullRequestReviewCommentOptions } from "./PullRequestReviewCommentOptions";
import { PullRequestReviewOptions } from "./PullRequestReviewOptions";
import { PullRequestTargetOptions } from "./PullRequestTargetOptions";
import { PushOptions } from "./PushOptions";
import { RegistryPackageOptions } from "./RegistryPackageOptions";
import { ReleaseOptions } from "./ReleaseOptions";
import { RepositoryDispatchOptions } from "./RepositoryDispatchOptions";
import { ScheduleOptions } from "./ScheduleOptions";
import { WatchOptions } from "./WatchOptions";
import { WorkflowDispatchOptions } from "./WorkflowDispatchOptions";
import { WorkflowRunOptions } from "./WorkflowRunOptions";

interface OnSettingProps {
	value?: Workflow["on"];
	onChange?: (value: any) => void;
}

export const OnSetting = ({ value, onChange }: OnSettingProps) => {
	const [selectedValue, setSelectedValue] = useState<Event | null>(null);
	const [selectedExtra, setSelectedExtra] = useState<any>();

	const isObjectValue = typeof value === "object" && !Array.isArray(value);

	const onAddClicked = () => {
		if (selectedValue) {
			if (selectedExtra) {
				if (isObjectValue) {
					onChange?.({
						...value,
						[selectedValue]: selectedExtra,
					});
				} else {
					onChange?.({
						[selectedValue]: selectedExtra,
					});
				}
			} else {
				if (isObjectValue) {
					onChange?.({
						...value,
						[selectedValue]: null,
					});
				} else {
					onChange?.({
						[selectedValue]: null,
					});
				}
			}
		}

		setSelectedValue(null);
		setSelectedExtra(null);
	};

	const onDeleteClicked = (key: Event) => {
		onChange?.(
			isObjectValue &&
				Object.fromEntries(Object.entries(value).filter(([k, _]) => k !== key)),
		);
	};

	const onEditClicked = (key: Event | null) => {
		if (key) {
			setSelectedValue(key);
			setSelectedExtra(value?.[key]);
		} else {
			setSelectedValue(null);
			setSelectedExtra(null);
		}
	};

	const events = {
		branch_protection_rule: (
			<BranchProtectionOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		check_run: (
			<CheckRunOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		check_suite: (
			<CheckSuiteOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		create: <></>,
		delete: <></>,
		deployment: <></>,
		deployment_status: <></>,
		discussion: (
			<DiscussionOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		discussion_comment: (
			<DiscussionCommentOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		fork: <></>,
		gollum: <></>,
		issue_comment: (
			<IssueCommentOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		issues: (
			<IssueOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		label: (
			<LabelOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		merge_group: (
			<MergeGroupOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		milestone: (
			<MileStoneOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		page_build: <></>,
		project: (
			<ProjectOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		project_card: (
			<ProjectCardOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		project_column: (
			<ProjectColumnOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		public: <></>,
		pull_request: (
			<PullRequestOptions
				value={selectedExtra}
				onChange={(key, value) =>
					setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
				}
			/>
		),
		pull_request_review: (
			<PullRequestReviewOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		pull_request_review_comment: (
			<PullRequestReviewCommentOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		pull_request_target: (
			<PullRequestTargetOptions
				value={selectedExtra}
				onChange={(key, value) =>
					setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
				}
			/>
		),
		push: (
			<PushOptions
				value={selectedExtra}
				onChange={(key, value) =>
					setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
				}
			/>
		),
		registry_package: (
			<RegistryPackageOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		release: (
			<ReleaseOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		repository_dispatch: (
			<RepositoryDispatchOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		schedule: (
			<ScheduleOptions
				value={selectedExtra}
				onChange={(values) =>
					setSelectedExtra(values.map((value) => ({ cron: value })))
				}
			/>
		),
		status: <></>,
		watch: (
			<WatchOptions
				value={selectedExtra?.types}
				onChange={(value) => setSelectedExtra({ types: value })}
			/>
		),
		workflow_call: <div>TODO</div>,
		workflow_dispatch: (
			<WorkflowDispatchOptions
				value={selectedExtra}
				onChange={(key, value) =>
					setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
				}
			/>
		),
		workflow_run: (
			<WorkflowRunOptions
				value={selectedExtra}
				onChange={(key, value) =>
					setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
				}
			/>
		),
	};

	return (
		<div className={style.container}>
			<Card>
				<CardContent className={style.container}>
					<Autocomplete
						id="tags-outlined"
						options={Object.keys(events) as Event[]}
						value={selectedValue}
						getOptionLabel={(option) => option}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField {...params} placeholder={"name"} />
						)}
						onChange={(_, value) => {
							onEditClicked(value);
						}}
					/>
					{selectedValue && events[selectedValue]}

					{/* TODO: Workflow call */}
				</CardContent>
				<CardActions>
					<IconButton aria-label="Add" onClick={onAddClicked}>
						<AddCircleOutline />
					</IconButton>
				</CardActions>
			</Card>

			{isObjectValue && (
				<>
					<Divider sx={{ marginTop: 2 }} />
					<Typography variant="h6" sx={{ marginTop: 1 }}>
						Current events
					</Typography>
					{Object.entries(value).map(([key, value]) => {
						const isSelectedValue = key === selectedValue;

						return (
							<Card className={cn(isSelectedValue && style.selected)}>
								<CardHeader
									title={key}
									action={
										<>
											<IconButton
												aria-label="Add"
												onClick={() => onEditClicked(key as Event)}
												disabled={isSelectedValue}
											>
												<Edit />
											</IconButton>
											<IconButton
												aria-label="Add"
												onClick={() => onDeleteClicked(key as Event)}
												disabled={isSelectedValue}
											>
												<Delete />
											</IconButton>
										</>
									}
								/>
								<CardContent className={style.cardContent}>
									{value && <pre>{YAML.stringify(value, null, 2)}</pre>}
								</CardContent>
							</Card>
						);
					})}
				</>
			)}
		</div>
	);
};
