import { Typography } from "@mui/material";
import style from "./TabPanel.module.scss";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export const a11yProps = (index: number) => {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
};

export const CustomTabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Typography className={style.container}>{children}</Typography>
			)}
		</div>
	);
};
