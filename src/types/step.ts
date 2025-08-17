import { LayoutItem } from ".";

export interface StepItem {
    id: string;
    label: string;
    items: LayoutItem[];

    onNextAction?: string;
}
export interface StepperConfig {
    steps: StepItem[];
}