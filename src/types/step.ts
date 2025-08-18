import { BaseLayoutItemConfig, Layout } from ".";

export interface StepItem {
    id: string;
    label: string;
    items: Layout;

    onNextAction?: string;
}
export interface StepperConfig extends BaseLayoutItemConfig {
    steps: StepItem[];
}