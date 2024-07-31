import fontColorContrast from "font-color-contrast";
import { useMemo } from "react";

export const useContrastColor = (backgroundColor: string): string => {
    const contrastColor = useMemo(() => {
        if (backgroundColor.indexOf("var(") === 0) {
            return "black";
        }
        return fontColorContrast(backgroundColor);
    }, [backgroundColor]);

    return contrastColor;
};