import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { SettingsRef } from "../../types";
import { Environment } from "../../types/workflowTypes";
import { a11yProps, CustomTabPanel } from "../UI/TabPanel";
import { BaseSetting } from "./BaseSetting";
import { StringSetting } from "./StringSetting";

interface EnvironmentSettingProps {
	value?: string | Environment;
}

export const EnvironmentSetting = forwardRef(
	({ value }: EnvironmentSettingProps, ref) => {
		const [currentValue, setCurrentValue] = useState(value);
		const [tab, setTab] = useState(0);

		const plainRef = useRef<SettingsRef>(null);
		const nameRef = useRef<SettingsRef>(null);
		const urlRef = useRef<SettingsRef>(null);

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => {
			const plainValue = plainRef?.current?.getValue();
			return plainValue;
		};

		useEffect(() => {
			setCurrentValue(value);
		}, [value]);

		const handleChange = (event: React.SyntheticEvent, newTab: number) => {
			setTab(newTab);
		};

		const isPlainValue = typeof currentValue === "string";
		const isObjectValue = typeof currentValue === "object";

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
						value={isPlainValue ? currentValue : undefined}
						name="Environment"
						ref={plainRef}
					/>
				</CustomTabPanel>
				<CustomTabPanel value={tab} index={1}>
					<BaseSetting settingName="Name">
						<StringSetting
							value={isObjectValue ? currentValue.name : undefined}
							name="Name"
							ref={nameRef}
						/>
					</BaseSetting>
					<BaseSetting settingName="URL">
						<StringSetting
							value={isObjectValue ? currentValue.url : undefined}
							name="URL"
							ref={urlRef}
						/>
					</BaseSetting>
				</CustomTabPanel>
			</div>
		);
	},
);
