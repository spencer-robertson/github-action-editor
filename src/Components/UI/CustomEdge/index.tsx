import { IconButton } from "@mui/material";
import {
	BaseEdge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
	useReactFlow,
} from "@xyflow/react";
import { X } from "react-feather";
import style from "./CustomEdge.module.scss";

export const CustomEdge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
}: EdgeProps) => {
	const { setEdges } = useReactFlow();
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const onEdgeClick = () => {
		setEdges((edges) => edges.filter((edge) => edge.id !== id));
	};

	return (
		<>
			<BaseEdge path={edgePath} markerEnd={markerEnd} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						// everything inside EdgeLabelRenderer has no pointer events by default
						// if you have an interactive element, set pointer-events: all
						pointerEvents: "all",
					}}
				>
					<button className={style.edgeButton} onClick={onEdgeClick}>
						<IconButton size="small">
							<X size={10} />
						</IconButton>
					</button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
};
