import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import {
	cloneElement,
	CSSProperties,
	PropsWithChildren,
	ReactElement,
	useState,
} from "react";
import baseStyle from "./BaseSetting.module.scss";

export const BootstrapTooltip = styled(
	({ className, ...props }: TooltipProps) => (
		<Tooltip {...props} arrow classes={{ popper: className }} />
	),
)(() => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: "white !important",
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "lightgray",
		maxWidth: 400,
	},
}));

interface BaseSettingProps {
	settingName?: string;
	settingDetails?: string;
	style?: CSSProperties;
}

export const BaseSetting = ({
	settingName,
	settingDetails,
	style,
	children,
}: PropsWithChildren<BaseSettingProps>) => {
	const [checked, setChecked] = useState(false);
	const newChildren =
		children && cloneElement(children as ReactElement, { checked, setChecked });

	return (
		<div className={baseStyle.container} style={style}>
			<div className={baseStyle.baseNameContainer}>
				{settingName && (
					<div className={baseStyle.settingName}>{settingName}</div>
				)}
				{settingDetails && (
					<BootstrapTooltip title={settingDetails} placement="right">
						<HelpOutlineOutlinedIcon sx={{ fontSize: 15 }} />
					</BootstrapTooltip>
				)}
			</div>
			<div>{newChildren}</div>
		</div>
	);
};
