

import DynamicButton from "../components/controls/DynamicButton"
import DynamicField from "../components/controls/DynamicField"
import DynamicTableComponent from "../components/controls/DynamicTableComponent"
import StepperComponent from "../components/controls/StepperComponent"
import TabsComponent from "../components/controls/TabsComponent"
import { LayoutItemConfigMap } from "../types"

export const componentRegistry: { [K in keyof LayoutItemConfigMap]: React.FC<LayoutItemConfigMap[K]> } = {
  button: DynamicButton,
  field: DynamicField,
  tabs: TabsComponent,
  table: DynamicTableComponent,
  stepper: StepperComponent,
}