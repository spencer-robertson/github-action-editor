import { NormalJob, Step } from "./workflowTypes";

export interface OpenJobSettingsState {
    job: NormalJob;
    id: string;
}

export interface OpenStepSettingsState {
    step: Step;
    jobId: string;
    stepId: string | undefined;
}

export interface SettingsRef {
    getValue: () => any;
}