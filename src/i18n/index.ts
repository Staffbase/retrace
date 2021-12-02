import * as en from "./en";
import * as de from "./de";
import config from "../renderer/store/ConfigStore";
import { useState } from "react";

type TranslationHook = typeof en;

export const useTranslation = (): TranslationHook => {
  const [value, setValue] = useState(
    config.get("locale") || navigator.language
  );

  config.onDidChange("locale", () => {
    setValue(config.get("locale"));
  });

  return value.startsWith("de") ? de : en;
};
