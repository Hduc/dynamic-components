import React from "react";
import LayoutView from "./components/layout/LayoutView";
import { defaultLayout } from "./config/layoutConfig";

const AppView: React.FC = () => (
    <LayoutView layoutJson={defaultLayout} />
);

export default AppView;
