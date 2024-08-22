import { Concurrency } from "../../types/workflowTypes";
import { BaseSetting } from "./BaseSetting";
import style from "./ConcurrencySetting.module.scss";
import { StringSetting } from "./StringSetting";

interface ConcurrencySettingProps {
	value?: Concurrency;
	onChange?: (value: Concurrency | undefined) => void;
}

export const ConcurrencySetting = ({
	value,
	onChange,
}: ConcurrencySettingProps) => {
	return (
		<div className={style.container}>
			<BaseSetting
				settingName="Group"
				settingDetails='Prevents a job from running unless a condition is met. You can use any supported context and expression to create a conditional. For more information on which contexts are supported in this key, see "Contexts."'
			>
				<StringSetting
					value={value?.group}
					name="Group"
					onChange={(newValue) => {
						onChange?.({ ...value, group: newValue } as any);
					}}
				/>
			</BaseSetting>
			<BaseSetting
				settingName="Cancel in progress"
				settingDetails='Prevents a job from running unless a condition is met. You can use any supported context and expression to create a conditional. For more information on which contexts are supported in this key, see "Contexts."'
			>
				<StringSetting
					value={value?.["cancel-in-progress"]}
					name="Cancel in progress"
					onChange={(newValue) => {
						onChange?.({ ...value, "cancel-in-progress": newValue } as any);
					}}
				/>
			</BaseSetting>
		</div>
	);
};
