import { useContext } from "react";
import { SettingsContext } from "../SettingsContext";

// ----------------------------------------------------------------------

const useSettings = () => useContext(SettingsContext);

export default useSettings;
