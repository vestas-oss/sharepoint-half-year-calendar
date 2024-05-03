import { SharePointContext } from "../contexts/SharePointContext";
import { useContext } from "react";

export const useSharePoint = () => {
    return useContext(SharePointContext);
};