import styled, { keyframes, css } from "styled-components";
import { Typography } from "antd";
import Image from "next/image";

const { Title, Text } = Typography;

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
`;

export const StyledBgImg = styled(Image)`
  width: 100%;
  object-fit: cover;
  aspect-ratio: 16/9;
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
  object-fit: cover;
  height: 80%; // # TODO: this will be removed - with  this all characters are the same height
  width: auto;
`;

export const StyledDialogTextWrapper = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);

  width: 100%;
  max-width: 1000px;
  height: 100%;
  max-height: 200px;

  background-color: rgba(0, 0, 0, 0.5);
  filter: blur(0.5px);
  color: white;

  padding: 0 0px 8px 0px;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const StyledCharacterNameWrapper = styled.div`
  position: relative;
  align-self: center;
  min-height: 24px;
  width: 100%;
  text-align: center;
  font-size: 20px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.25) 100%
  );
`;

export const StyledCharacterTextWrapper = styled.div`
  padding: 8px;
`;

export const StyledCharacterText = styled(Text)`
  &&& {
    color: white;
    font-size: 18px;
  }
`;
