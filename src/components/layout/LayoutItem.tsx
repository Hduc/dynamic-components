import React from "react";
import { LayoutItem as ItemType } from "../../types";
import { Box, Button, Paper, Typography } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import ConfigurableWrapper from "../controls/ConfigurableWrapper";

interface LayoutItemProps {
  item: ItemType;
  index:number
  length:number
  Component: React.ComponentType<any>;
}

const LayoutItem: React.FC<LayoutItemProps> = ({ item, Component, index, length }) => {
 
  return (<ConfigurableWrapper  type={item.type} id={item.id} index={index} length={length} >
      <Component {...item} />
      </ConfigurableWrapper>
  );
};

export default LayoutItem;
