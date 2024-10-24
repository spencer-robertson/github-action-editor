import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useState } from "react";
import { Environment } from "../../types/workflowTypes";
import { a11yProps, CustomTabPanel } from "../UI/TabPanel";
import { BaseSetting } from "./BaseSetting";
import { StringSetting } from "./StringSetting";

interface EnvironmentSettingProps {
	value?: string | Environment;
	onChange?: (value: string | Environment | undefined) => void;
}

export const EnvironmentSetting = ({
	value,
	onChange,
}: EnvironmentSettingProps) => {
	const [tab, setTab] = useState(0);

	const handleChange = (_: React.SyntheticEvent, newTab: number) => {
		setTab(newTab);
	};

	const isPlainValue = typeof value === "string";
	const isObjectValue = typeof value === "object";

	return (
		<div>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={tab}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label="Single environment name" {...a11yProps(0)} />
					<Tab label="Environment name and URL" {...a11yProps(1)} />
				</Tabs>
			</Box>
			<CustomTabPanel value={tab} index={0}>
				<StringSetting
					value={isPlainValue ? value : undefined}
					name="Environment"
					onChange={(newValue) => {
						if (typeof newValue === "string") {
							onChange?.(newValue);
						}
					}}
				/>
			</CustomTabPanel>
			<CustomTabPanel value={tab} index={1}>
				<BaseSetting settingName="Name">
					<StringSetting
						value={isObjectValue ? value.name : undefined}
						name="Name"
						onChange={(newValue) => {
							if (typeof newValue === "string") {
								if (typeof value === "string") {
									onChange?.({ name: newValue, url: "" });
								} else {
									onChange?.({ ...value, name: newValue });
								}
							}
						}}
					/>
				</BaseSetting>
				<BaseSetting settingName="URL">
					<StringSetting
						value={isObjectValue ? value.url : undefined}
						name="URL"
						onChange={(newValue) => {
							if (typeof newValue === "string") {
								if (typeof value === "string") {
									onChange?.({ name: "", url: newValue });
								} else {
									onChange?.({ ...value, url: newValue });
								}
							}
						}}
					/>
				</BaseSetting>
			</CustomTabPanel>
		</div>
	);
};
