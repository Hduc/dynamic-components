import { LayoutItem } from ".";
export interface TabItem {
    id: string;
    label: string;
    items: LayoutItem[];
  }
 export  interface TabsConfig {
    tabs: TabItem[];
  }