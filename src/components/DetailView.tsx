import React, { ReactElement } from "react";
import List from "./List";
import Calendar from "./Calendar";
import styled from "styled-components";

export default function DetailView(): ReactElement {
  return (
    <StyledDetails>
      <Calendar />
      <List />
    </StyledDetails>
  );
}

const StyledDetails = styled.div``;
