import styled, { keyframes, css } from "styled-components";
import { Typography } from "antd";

const { Title } = Typography;

const fadeIn = keyframes`
  from {
  opacity: 0;
  } 

  to {
  opacity: 1
  }
`;

const fadeOut = keyframes`
  from {
  opacity: 1;
  } 

  to {
  opacity: 0;
  }
`;

export const StyledActTitle = styled(Title)<{
  /**
   * time in seconds of the whole animation. FadeIn takes 1/3 of that time. Fully visible part takes 1/3 of that time and fadeOut takes the last 1/3 of that time
   * @default 6 seconds
   */
  $animationDuration?: number;
}>`
  &&& {
    color: white;
  }
  user-select: none;
  opacity: 1;

  ${({ $animationDuration = 6 }) =>
    css`
      /* forwards means that after animation is finished its last state remains */
      animation: ${fadeIn} ${$animationDuration / 3}s 0s linear forwards,
        ${fadeOut} ${$animationDuration / 3}s ${($animationDuration / 3) * 2}s
          linear forwards;
    `}

  margin: 0 16px;
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    margin: unset;
  }
`;

export const StyledGameWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100vh;
  background-color: black;
`;

export const StyledEndGameScreenWrapper = styled.div<{
  animationDuration?: number;
}>`
  z-index: 101;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  opacity: 0;

  ${({ animationDuration = 6 }) =>
    css`
      /* forwards means that after animation is finished its last state remains */
      animation: ${fadeIn} ${animationDuration}s 0s linear forwards;
    `}

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledEndGameText = styled(Title)<{
  $animationDuration?: number;
  $animationDelay?: number;
}>`
  opacity: 0;
  user-select: none;
  ${({ $animationDuration = 6, $animationDelay = 6 }) =>
    css`
      /* forwards means that after animation is finished its last state remains */
      animation: ${fadeIn} ${$animationDuration / 3}s ${$animationDelay}s linear
          forwards,
        ${fadeOut} ${$animationDuration / 3}s
          ${($animationDuration / 3) * $animationDelay}s linear forwards;
    `}
`;

export const StyledBgImg = styled.img`
  width: 100%;
  object-fit: cover;
  height: 100%;
  user-select: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    aspect-ratio: 16/9;
    height: unset;
  }
`;

interface StyledCharacterImgProps {
  left: number;
  zIndex: number;
}

export const StyledCharacterImg = styled.img<StyledCharacterImgProps>`
  display: block;
  position: absolute;
  left: ${({ left }) => left}%;
  bottom: 2px;
  z-index: ${({ zIndex }) => zIndex};
  transform: translateX(-50%);
  object-fit: cover;
  height: 60%; // # TODO: this will be removed - with  this all characters are the same height
  width: auto;

  @media (orientation: landscape) {
    // height 90% but only under width of theme.breakpoints.xl becuase the lower media will override it once it reaches breakpoints.xl with resolution
    height: 90%;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    height: 80%; // # TODO: this will be removed - with  this all characters are the same height
    transform: unset;
  }
`;

export const StyledDialogTextWrapper = styled.div`
  position: absolute;
  bottom: 8px;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);

  width: 100%;
  max-width: calc(100vw - 2 * 8px);
  height: 100%;
  max-height: 170px;

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    bottom: 16px;
    max-width: 1000px;
    max-height: 200px;
  }

  background-color: rgba(0, 0, 0, 0.5);
  filter: blur(0.5px);
  color: white;

  padding: 0 0px 8px 0px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const StyledCharacterNameWrapper = styled.div`
  user-select: none;
  position: relative;
  align-self: center;
  min-height: 35px;
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    font-size: 20px;
  }

  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.25) 100%
  );
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const StyledCharacterTextWrapper = styled.div`
  padding: 8px;
`;
