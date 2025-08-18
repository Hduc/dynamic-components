import React from "react";
import LayoutRenderer from "./components/layout/LayoutRenderer";

const App: React.FC = () => {
  return (
    <LayoutRenderer inLayout={[
      {
        id: 'ádd',
        type: 'field',
        config: {
          id: 'ádd',
          type: 'field',
          inputType: 'text',
          label: 'Trường mới',
          grid: 12,
          validation: { required: false },
          config: {}
        }
      }
    ]} />
  );
};

export default App;
