import { createContext } from "react";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

export type DynamicLayoutContextType = ReturnType<typeof useDynamicLayout>;
const DynamicLayoutContext = createContext<DynamicLayoutContextType | null>(null);
export  default DynamicLayoutContext