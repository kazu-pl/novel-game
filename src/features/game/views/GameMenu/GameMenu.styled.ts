import { Button } from "antd";
import styled, { css } from "styled-components";

export const StyledButton = styled(Button)`
  && {
    border: none;
    color: white;
  }

  &:hover {
    border: none;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.3)
    );
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
    `}
`;
