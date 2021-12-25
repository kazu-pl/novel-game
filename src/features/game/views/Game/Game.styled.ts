import styled from "styled-components";
import { Typography } from "antd";

const { Title, Text } = Typography;

export const StyledLoadingErrorText = styled(Title)`
  &&& {
    color: white;
  }
  user-select: none;
`;

export const StyledLoadingText = styled(Text)`
  &&& {
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    padding: 0;
  }
`;
