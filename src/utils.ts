import { NormalJob, Step, Workflow } from "./types/workflowTypes";

import classNames from "classnames";

export function cn(...args: classNames.ArgumentArray): string | undefined {
	return classNames(args) || undefined;
}

export const getCurrentStep = (step: Step, id: string | undefined) =>
	step.id === id || step.name === id || step.run === id || step.uses === id;

export const useNeedsConnections = (
	workflow: Workflow | undefined,
	jobId?: string,
) => {
	if (!workflow) {
		return {
			value: 0,
			id: undefined,
			deepestRoutes: undefined,
		};
	}

	if (jobId) {
		const needs = workflow.jobs[jobId]?.needs?.length || 0;
		const hasConnections = needs > 0;

		if (!hasConnections) {
			return { value: 0, id: undefined };
		}
	}

	const jobs = Object.entries(workflow.jobs).map(([id, job]) => {
		return { ...job, id };
	});

	const { depths, needsObj } = findDeepestRoute(jobs);

	if (!jobId) {
		return {
			value: 0,
			id: undefined,
			needsObj,
			deepestRoutes: depths,
		};
	}

	const value = depths.get(jobId) || 0;

	return {
		value,
		id: findIdByValue(depths, value) === jobId,
		needs: Array.isArray(workflow.jobs[jobId]?.needs)
			? workflow.jobs[jobId]?.needs
			: [workflow.jobs[jobId]?.needs],
	};
};

type NormalJobWithId = (NormalJob & { id: string }) | undefined;

const findDeepestRoute = (objects: NormalJobWithId[]) => {
	// Create a map to store the depths of each object
	const depths = new Map<string, number>();

	const needsObj: { [key: string]: string[] } = {};

	// Helper function to calculate the depth of an object
	const calculateDepth = (object: NormalJobWithId) => {
		if (!object) {
			return 0;
		}

		// If the object's depth is already calculated, return it
		if (depths.has(object.id)) {
			return depths.get(object.id) || 0;
		}

		let maxDepth = 0;

		// Check if the object has any needs
		if (object.needs && object.needs?.length > 0) {
			const needs = Array.isArray(object.needs) ? object.needs : [object.needs];

			// Iterate over the needs of the object
			for (const needId of needs) {
				// Find the corresponding needed object
				const neededObject = objects.find((obj) => obj?.id === needId);

				needsObj[object.id] = [...(needsObj[object.id] || []), needId];

				// Recursively calculate the depth of the needed object
				calculateDepth(neededObject);
				const newDepth = depths.get(needId) || 0;

				// Update the maximum depth if needed
				if (newDepth > maxDepth) {
					maxDepth = newDepth;
				}
			}
			// Update the depth of the current object
			depths.set(object.id, maxDepth + 1);
		} else {
			depths.set(object.id, 0);
		}

		return maxDepth;
	};

	// Iterate over each object in the list
	for (const object of objects) {
		calculateDepth(object);
	}

	return { depths, needsObj };
};

const findIdByValue = (
	deepestRoutes: Map<string, number>,
	targetValue: number,
) => {
	const entries = Array.from(deepestRoutes.entries());

	for (const [id, value] of entries) {
		if (value === targetValue) {
			return id; // Found the first ID with the specific value
		}
	}

	return null; // No ID found with the specific value
};

export const findIdsByValue = (
	deepestRoutes: Map<string, number> | undefined,
	targetValue: number,
) => {
	const entries = Array.from(deepestRoutes?.entries() || []);
	const ids = [];

	for (const [id, value] of entries) {
		if (value === targetValue) {
			ids.push(id); // Found the first ID with the specific value
		}
	}

	return ids; // No ID found with the specific value
};
