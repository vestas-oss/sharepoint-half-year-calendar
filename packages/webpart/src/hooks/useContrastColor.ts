import fontColorContrast from "font-color-contrast";
import { useMemo } from "react";
import { tokens } from "@fluentui/react-components";

export const useContrastColor = (backgroundColor?: string): string => {
    if (!backgroundColor) {
        backgroundColor = tokens.colorBrandForegroundInvertedHover;
    }
    const contrastColor = useMemo(() => {
        if (backgroundColor.indexOf("var(") === 0) {
            return "black";
        }
        return fontColorContrast(backgroundColor);
    }, [backgroundColor]);

    return contrastColor;
};