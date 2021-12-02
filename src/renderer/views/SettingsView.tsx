/*
Copyright 2021, Staffbase GmbH and contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import styled from "styled-components";
import config from "../store/ConfigStore";
import Page from "../components/Page";
import { useTranslation } from "../../i18n";

export default function SettingsView() {
  const { PAGES, PAGE_SETTINGS } = useTranslation();
  const [autostart, setAutostart] = useState(config.get("autostart"));
  const [shortcut, setShortcut] = useState(config.get("floatShortcut"));

  useEffect(() => {
    config.set("floatShortcut", shortcut);
    ipcRenderer.send("floatShortcut-changed", shortcut);
  }, [shortcut]);

  useEffect(() => {
    config.set("autostart", autostart);
    ipcRenderer.send("autostart-changed", autostart);
  }, [autostart]);

  return (
    <Page id="settings" title={PAGES.settings}>
      <StyledSettings>
        <div>
          <label htmlFor="autostart">{PAGE_SETTINGS.autostart}</label>
          <input
            id="autostart"
            type="checkbox"
            checked={autostart}
            onChange={(e) => setAutostart(e.target.checked)}
          />
        </div>

        <div className="vertical">
          <label htmlFor="shortcut">{PAGE_SETTINGS.shortcut}</label>
          <input
            id="shortcut"
            type="text"
            value={shortcut}
            onChange={(e) => setShortcut(e.target.value)}
          />
        </div>
      </StyledSettings>
    </Page>
  );
}

const StyledSettings = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    margin-top: 15px;

    &.vertical {
      flex-direction: column;
    }

    > label {
      display: flex;
      flex: 1 1 auto;
      color: var(--text);
    }

    > input[type="text"] {
      display: block;
      border: none;
      font-size: 16px;
      margin-top: 5px;
      padding: 8px 10px;
      background-color: var(--backgroundLight);
      color: var(--textInput);
      border: 1px solid var(--backgroundDarker);
      border-radius: 3px;
      outline: none;
    }
  }
`;
