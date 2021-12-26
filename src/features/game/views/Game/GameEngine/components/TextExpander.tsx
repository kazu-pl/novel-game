import styled from "styled-components";
import { Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import {
  selectIsTextRevealed,
  setIsTextRevealed,
} from "features/game/store/gameSlice";
const { Text } = Typography;

export const StyledCharacterText = styled(Text)`
  &&& {
    user-select: none;
    color: white;
    font-size: 18px;
  }
`;

export interface TextExpanderProps {
  children: string;
  showWholeText?: boolean;
  timeToRevealNextLetter?: number;
}

const TextExpander = ({
  children,
  timeToRevealNextLetter = 70,
}: TextExpanderProps) => {
  const [textToDisplay, setTextToDisplay] = useState("");
  const textIndexRef = useRef(0);
  const isTextRevealed = useAppSelector(selectIsTextRevealed);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!children.length) return;

    const revealText = () => {
      setTextToDisplay(children.slice(0, textIndexRef.current));
      textIndexRef.current++;

      if (isTextRevealed) {
        setTextToDisplay(children.slice(0, children.length));
        textIndexRef.current = 0;
        window.clearInterval(typingIndex);
      }

      if (textIndexRef.current === children.length) {
        dispatch(setIsTextRevealed(true));
        textIndexRef.current = 0;
        window.clearInterval(typingIndex);
      }
    };

    const typingIndex = window.setInterval(revealText, timeToRevealNextLetter);

    return () => window.clearInterval(typingIndex);
  }, [children, isTextRevealed, dispatch, timeToRevealNextLetter]);

  return <StyledCharacterText>{textToDisplay}</StyledCharacterText>;
};

export default TextExpander;
