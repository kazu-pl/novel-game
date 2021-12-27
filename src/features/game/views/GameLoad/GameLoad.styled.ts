import styled from "styled-components";
import { Typography } from "antd";
const { Paragraph } = Typography;

export const StyledSaveWrapper = styled.div<{ borderColor?: "light" | "dark" }>`
  border: 1px solid
    ${({ borderColor }) =>
      borderColor === "dark"
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(255, 255, 255, 0.2)"};
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledSaveContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledSaveIconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface TextProps {
  $color?: string;
}

export const StyledParagraph = styled(Paragraph)<TextProps>`
  color: ${({ $color }) => $color || "white"};
`;

export const StyledSaveTextTitle = styled.span<TextProps>`
  color: ${({ $color }) => $color || "white"};
  font-weight: bold;
`;
