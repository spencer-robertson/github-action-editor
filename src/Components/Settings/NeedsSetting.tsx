import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { WorkflowContext } from "../../Contexts/WorkflowContext";
import { JobNeeds } from "../../types/workflowTypes";

interface NeedsSettingProps {
	value: JobNeeds | undefined;
	currentJob: string;
}

export const NeedsSetting = forwardRef(
	({ value, currentJob }: NeedsSettingProps, ref) => {
		const { workflow } = useContext(WorkflowContext);

		const [currentValue, setCurrentValue] = useState(
			Array.isArray(value) ? value : [value],
		);

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => currentValue.filter((job) => job !== undefined);

		useEffect(() => {
			setCurrentValue(Array.isArray(value) ? value : [value]);
		}, [value]);

		// Filter out the current job from the list of jobs
		const allJobs = Object.entries(workflow?.jobs || {})
			.filter(([id]) => currentJob !== id)
			?.map(([id, { name }]) => ({ id, name }));

		const values = allJobs.filter(({ id }) => currentValue.includes(id));

		return (
			<Autocomplete
				multiple
				id="tags-outlined"
				options={allJobs}
				value={values}
				getOptionLabel={(option) => option.name || ""}
				filterSelectedOptions
				renderInput={(params) => <TextField {...params} placeholder="Needs" />}
				onChange={(_, value) => {
					setCurrentValue(value.map(({ id }) => id));
				}}
			/>
		);
	},
);
