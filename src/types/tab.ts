import { BaseLayoutItemConfig, Layout } from ".";
export interface TabItem {
  id: string;
  label: string;
  items: Layout;
}

export interface TabsConfig extends BaseLayoutItemConfig {
  tabs: TabItem[];
}