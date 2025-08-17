import DynamicField from "../components/controls/DynamicField";
import DynamicTableComponent from "../components/controls/DynamicTableComponent";
import DynamicButton from "../components/controls/DynamicButton";
import TabsComponent from "../components/controls/TabsComponent";
import StepperComponent from "../components/controls/StepperComponent";


export const componentRegistry: Record<string, React.ComponentType<any>> = {
  field:DynamicField,
  button: DynamicButton,
  //input: InputControl,
  tabs:TabsComponent,
  table:DynamicTableComponent,
  stepper:StepperComponent,
};