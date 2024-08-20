import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { SettingsRef } from "../../types";
import { Concurrency } from "../../types/workflowTypes";
import { BaseSetting } from "./BaseSetting";
import style from "./ConcurrencySetting.module.scss";
import { StringSetting } from "./StringSetting";

interface ConcurrencySettingProps {
	value?: Concurrency;
}

export const ConcurrencySetting = forwardRef(
	({ value }: ConcurrencySettingProps, ref) => {
		const [currentValue, setCurrentValue] = useState(value);

		const groupRef = useRef<SettingsRef>(null);
		const cancelInProgressRef = useRef<SettingsRef>(null);

		useImperativeHandle(ref, () => ({ getValue }));
		const getValue = () => {
			const groupValue = groupRef?.current?.getValue();
			const cancelInProgressValue = cancelInProgressRef?.current?.getValue();

			return { group: groupValue, "cancel-in-progress": cancelInProgressValue };
		};

		useEffect(() => {
			setCurrentValue(value);
		}, [value]);

		return (
			<div className={style.container}>
				<BaseSetting
					settingName="Group"
					settingDetails='Prevents a job from running unless a condition is met. You can use any supported context and expression to create a conditional. For more information on which contexts are supported in this key, see "Contexts."'
				>
					<StringSetting
						ref={groupRef}
						value={currentValue?.group}
						name="Group"
					/>
				</BaseSetting>
				<BaseSetting
					settingName="Cancel in progress"
					settingDetails='Prevents a job from running unless a condition is met. You can use any supported context and expression to create a conditional. For more information on which contexts are supported in this key, see "Contexts."'
				>
					<StringSetting
						ref={cancelInProgressRef}
						value={currentValue?.["cancel-in-progress"]}
						name="Cancel in progress"
					/>
				</BaseSetting>
			</div>
		);
	},
);
