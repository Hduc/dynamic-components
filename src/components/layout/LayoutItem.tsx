import React from "react";
import { componentRegistry } from "../../config/componentRegistry";
import { LayoutItemConfig, LayoutItemConfigMap } from '../../types'

export default function LayoutItem<T extends LayoutItemConfig["type"]>({ config }: {  config: LayoutItemConfigMap[T]}) {
  const Component = componentRegistry[config.type] as React.FC<LayoutItemConfigMap[T]>
  return <Component {...config} />
}
