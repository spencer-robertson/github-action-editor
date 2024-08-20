import { createContext, Dispatch, SetStateAction } from "react";
import { Workflow } from "../types/workflowTypes";

export const WorkflowContext = createContext<{
    workflow?: Workflow;
    setWorkflow?: Dispatch<SetStateAction<Workflow | undefined>>;
    workflowChanged?: {
        change: Workflow;
        message: string;
    }[];
    setWorkflowChanged?: Dispatch<
        SetStateAction<
            {
                change: Workflow;
                message: string;
            }[]
        >
    >;
}>({});