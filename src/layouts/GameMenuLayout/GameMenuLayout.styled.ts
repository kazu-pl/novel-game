import styled from "styled-components";
import { Typography } from "antd";

const { Text } = Typography;

export const StyledMenuLayoutWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 2 * 24px);
  height: calc(100% - 2 * 24px);

  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: unset;
    height: unset;
  }
`;

export const StyledWrapper = styled.div`
  min-height: 100vh;
  background-color: black;
  background-position: center;
  background-size: cover;
  position: relative;
`;

export const StyledBgImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StyledLoadingText = styled(Text)`
  &&& {
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    padding: 0;
    user-select: none;
  }
`;
