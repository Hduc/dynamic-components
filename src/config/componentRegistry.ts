import DynamicField from "../components/controls/DynamicField";
import DynamicTableComponent from "../components/controls/DynamicTableComponent";
import DynamicButton from "../components/controls/DynamicButton";
import TabsComponent from "../components/controls/TabsComponent";
import StepperComponent from "../components/controls/StepperComponent";
import { ComponentRegistry } from "../types";


export const componentRegistry:ComponentRegistry= {
  field:DynamicField,
  button: DynamicButton,
  //input: InputControl,
  tabs:TabsComponent,
  table:DynamicTableComponent,
  stepper:StepperComponent,
};