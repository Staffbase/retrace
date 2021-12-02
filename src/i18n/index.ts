import * as en from "./en";
import * as de from "./de";
import config from "../renderer/store/ConfigStore";
import { useEffect, useState } from "react";

type TranslationHook = typeof en;

export const useTranslation = (): TranslationHook => {
  const [value, setValue] = useState(config.get("locale"));

  useEffect(() => {
    if (!config.get("locale") && navigator.language) {
      config.set("locale", navigator.language);
    }
  }, []);

  config.onDidChange("locale", () => {
    setValue(config.get("locale"));
  });

  return value.startsWith("de") ? de : en;
};

export const getTranslation = () => {
  return config.get("locale").startsWith("de") ? de : en;
};
