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

import React from "react";
import List from "../components/List";
import Page from "../components/Page";
import styled from "styled-components";
import { useTranslation } from "../../i18n";

export default function HistoryView() {
  const { PAGES } = useTranslation();

  return (
    <Page id="history" title={PAGES.logbook}>
      <StyledListSection>
        <List showAll={true} />
      </StyledListSection>
    </Page>
  );
}

const StyledListSection = styled.section`
  margin-top: 15px;

  li {
    padding-left: 0;
    padding-right: 0;
  }
`;
