import { AddCircleOutline } from "@mui/icons-material";
import {
	Autocomplete,
	Card,
	CardActions,
	CardContent,
	IconButton,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Workflow } from "../../types/workflowTypes";

interface OnSettingProps {
	value?: Workflow["on"];
	onChange?: (value: any) => void;
}

export const OnSetting = ({ value, onChange }: OnSettingProps) => {
	const [selectedValue, setSelectedValue] = useState<string | null>();
	const [selectedExtra, setSelectedExtra] = useState<any>();

	const isPlainValue = typeof value === "string" || Array.isArray(value);
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
	};

	const events = [
		"branch_protection_rule",
		"check_run",
		"check_suite",
		"create",
		"delete",
		"deployment",
		"deployment_status",
		"discussion",
		"discussion_comment",
		"fork",
		"gollum",
		"issue_comment",
		"issues",
		"label",
		"merge_group",
		"milestone",
		"page_build",
		"project",
		"project_card",
		"project_column",
		"public",
		"pull_request",
		"pull_request_review",
		"pull_request_review_comment",
		"pull_request_target",
		"push",
		"registry_package",
		"release",
		"repository_dispatch",
		"schedule",
		"status",
		"watch",
		"workflow_call",
		"workflow_dispatch",
		"workflow_run",
	];

	return (
		<div>
			<Card>
				<CardContent>
					<Autocomplete
						id="tags-outlined"
						options={events}
						value={selectedValue}
						getOptionLabel={(option) => option}
						filterSelectedOptions
						renderInput={(params) => (
							<TextField {...params} placeholder={"name"} />
						)}
						onChange={(_, value) => {
							setSelectedValue?.(value);
							setSelectedExtra?.(undefined);
						}}
					/>
					{selectedValue === "branch_protection_rule" && (
						<BranchProtectionOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "check_run" && (
						<CheckRunOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "check_suite" && (
						<CheckSuiteOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "discussion" && (
						<DiscussionOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "discussion_comment" && (
						<DiscussionCommentOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "issue_comment" && (
						<IssueCommentOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "issues" && (
						<IssueOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "label" && (
						<LabelOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "merge_group" && (
						<MergeGroupOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "milestone" && (
						<MileStoneOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "project" && (
						<ProjectOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "project_card" && (
						<ProjectCardOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "project_column" && (
						<ProjectColumnOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "pull_request" && (
						<PullRequestOptions
							value={selectedExtra}
							onChange={(key, value) =>
								setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
							}
						/>
					)}
					{selectedValue === "pull_request_review" && (
						<PullRequestReviewOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "pull_request_review_comment" && (
						<PullRequestReviewCommentOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "pull_request_target" && (
						<PullRequestTargetOptions
							value={selectedExtra}
							onChange={(key, value) =>
								setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
							}
						/>
					)}
					{selectedValue === "push" && (
						<PushOptions
							value={selectedExtra}
							onChange={(key, value) =>
								setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
							}
						/>
					)}
					{selectedValue === "registry_package" && (
						<RegistryPackageOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "release" && (
						<ReleaseOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "repository_dispatch" && (
						<RepositoryDispatchOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "schedule" && (
						<ScheduleOptions
							value={selectedExtra?.cron}
							onChange={(value) => setSelectedExtra({ cron: value })}
						/>
					)}
					{selectedValue === "watch" && (
						<WatchOptions
							value={selectedExtra?.types}
							onChange={(value) => setSelectedExtra({ types: value })}
						/>
					)}
					{selectedValue === "workflow_run" && (
						<WorkflowRunOptions
							value={selectedExtra}
							onChange={(key, value) =>
								setSelectedExtra((prev: any) => ({ ...prev, [key]: value }))
							}
						/>
					)}
				</CardContent>
				<CardActions>
					<IconButton aria-label="Add" onClick={onAddClicked}>
						<AddCircleOutline />
					</IconButton>
				</CardActions>
			</Card>
			{isObjectValue &&
				Object.entries(value).map(([key, value]) => {
					return (
						<Card>
							<CardContent>
								{key}
								{value && <pre>{JSON.stringify(value, null, 2)}</pre>}
							</CardContent>
						</Card>
					);
				})}
		</div>
	);
};

const BranchProtectionOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "deleted"];
	return (
		<Autocomplete
			multiple
			id="branch-protection-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const CheckRunOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "rerequested", "completed", "requested_action"];

	return (
		<Autocomplete
			multiple
			id="check-run-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const CheckSuiteOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["completed", "requested", "rerequested"];

	return (
		<Autocomplete
			multiple
			id="check-suite-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const DiscussionOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = [
		"created",
		"edited",
		"deleted",
		"transferred",
		"pinned",
		"unpinned",
		"labeled",
		"unlabeled",
		"locked",
		"unlocked",
		"category_changed",
		"answered",
		"unanswered",
	];

	return (
		<Autocomplete
			multiple
			id="discussion-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const DiscussionCommentOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="discussion-comment-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const IssueCommentOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="issue-comment-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const IssueOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = [
		"opened",
		"edited",
		"deleted",
		"transferred",
		"pinned",
		"unpinned",
		"closed",
		"reopened",
		"assigned",
		"unassigned",
		"labeled",
		"unlabeled",
		"locked",
		"unlocked",
		"milestoned",
		"demilestoned",
	];

	return (
		<Autocomplete
			multiple
			id="issue-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const LabelOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="label-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const MergeGroupOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["checks_requested"];

	return (
		<Autocomplete
			multiple
			id="merge-group-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const MileStoneOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "closed", "opened", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="milestone-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const ProjectOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "closed", "reopened", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="project-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const ProjectCardOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "converted", "moved", "deleted"];

	return (
		<Autocomplete
			multiple
			id="project-card-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const ProjectColumnOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "moved", "deleted"];

	return (
		<Autocomplete
			multiple
			id="project-column-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const PullRequestOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: string[]) => void;
}) => {
	const options = [
		"assigned",
		"unassigned",
		"labeled",
		"unlabeled",
		"opened",
		"edited",
		"closed",
		"reopened",
		"synchronize",
		"converted_to_draft",
		"locked",
		"unlocked",
		"enqueued",
		"dequeued",
		"milestoned",
		"demilestoned",
		"ready_for_review",
		"review_requested",
		"review_request_removed",
		"auto_merge_enabled",
		"auto_merge_disabled",
	];

	return (
		<>
			<Autocomplete
				multiple
				id="pull-request-options"
				options={options}
				value={value?.types}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
				onChange={(_, value) => {
					onChange?.("types", value);
				}}
			/>
			<Autocomplete
				multiple
				id="pull-request-options-branches"
				options={[]}
				value={value?.branches}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="pull-request-options-paths"
				options={[]}
				value={value?.paths}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Paths"} />
				)}
				onChange={(_, value) => {
					onChange?.("paths", value);
				}}
				freeSolo
			/>
		</>
	);
};

const PullRequestReviewOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["submitted", "edited", "dismissed"];

	return (
		<Autocomplete
			multiple
			id="pull-request-review-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const PullRequestReviewCommentOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["created", "edited", "deleted"];

	return (
		<Autocomplete
			multiple
			id="pull-request-review-comment-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const PullRequestTargetOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: string[]) => void;
}) => {
	const options = [
		"assigned",
		"unassigned",
		"labeled",
		"unlabeled",
		"opened",
		"edited",
		"closed",
		"reopened",
		"synchronize",
		"converted_to_draft",
		"ready_for_review",
		"locked",
		"unlocked",
		"review_requested",
		"review_request_removed",
		"auto_merge_enabled",
		"auto_merge_disabled",
	];

	return (
		<>
			<Autocomplete
				multiple
				id="pull-request-target-options"
				options={options}
				value={value?.types}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
				onChange={(_, value) => {
					onChange?.("types", value);
				}}
			/>
			<Autocomplete
				multiple
				id="pull-request-target-options-branches"
				options={[]}
				value={value?.branches}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="pull-request-target-options-paths"
				options={[]}
				value={value?.paths}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Paths"} />
				)}
				onChange={(_, value) => {
					onChange?.("paths", value);
				}}
				freeSolo
			/>
		</>
	);
};

const PushOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: string[]) => void;
}) => {
	return (
		<>
			<Autocomplete
				multiple
				id="push-options-branches"
				options={[]}
				value={value?.branches}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="push-options-paths"
				options={[]}
				value={value?.paths}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Paths"} />
				)}
				onChange={(_, value) => {
					onChange?.("paths", value);
				}}
				freeSolo
			/>
			<Autocomplete
				multiple
				id="push-options-tags"
				options={[]}
				value={value?.tags}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => <TextField {...params} placeholder={"Tags"} />}
				onChange={(_, value) => {
					onChange?.("tags", value);
				}}
				freeSolo
			/>
		</>
	);
};

const RegistryPackageOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["published", "updated"];

	return (
		<Autocomplete
			multiple
			id="registry-package-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const ReleaseOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = [
		"published",
		"unpublished",
		"created",
		"edited",
		"deleted",
		"prereleased",
		"released",
	];

	return (
		<Autocomplete
			multiple
			id="release-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

const RepositoryDispatchOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	return (
		<Autocomplete
			multiple
			options={[]}
			id="repository-dispatch-options"
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
			freeSolo
		/>
	);
};

const ScheduleOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string) => void;
}) => {
	return (
		<TextField
			id="schedule-options"
			value={value}
			placeholder="Cron expression"
			onChange={(e) => {
				onChange?.(e.target.value);
			}}
		/>
	);
};

const WatchOptions = ({
	value,
	onChange,
}: {
	value: string[] | undefined;
	onChange: (value: string[]) => void;
}) => {
	const options = ["started"];

	return (
		<Autocomplete
			multiple
			id="watch-options"
			options={options}
			value={value}
			getOptionLabel={(option) => option}
			filterSelectedOptions
			renderInput={(params) => <TextField {...params} placeholder={"Type"} />}
			onChange={(_, value) => {
				onChange?.(value);
			}}
		/>
	);
};

// TODO:
// const workflow_dispatch

const WorkflowRunOptions = ({
	value,
	onChange,
}: {
	value: any;
	onChange: (key: string, value: string[]) => void;
}) => {
	const options = ["completed", "requested", "in_progress"];

	return (
		<>
			<Autocomplete
				multiple
				id="workflow-run-options-types"
				options={options}
				value={value?.types}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Types"} />
				)}
				onChange={(_, value) => {
					onChange?.("types", value);
				}}
			/>
			<Autocomplete
				multiple
				id="workflow-run-options-workflows"
				options={[]}
				value={value?.workflows}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Workflows"} />
				)}
				onChange={(_, value) => {
					onChange?.("workflows", value);
				}}
				freeSolo
			/>

			<Autocomplete
				multiple
				id="workflow-run-options-branches"
				options={[]}
				value={value?.branches}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField {...params} placeholder={"Branches"} />
				)}
				onChange={(_, value) => {
					onChange?.("branches", value);
				}}
				freeSolo
			/>
		</>
	);
};
