import styled from "styled-components";
import { Typography } from "antd";
// import {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";
const { Text } = Typography;

export const StyledCharacterText = styled(Text)`
  &&& {
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
}: // showWholeText,
// timeToRevealNextLetter = 100,
TextExpanderProps) => {
  // const [textToDisplay, setTextToDisplay] = useState("");
  // const textIndexRef = useRef(0);

  // useLayoutEffect(() => {
  //   if (children) {
  //     setTextToDisplay(children[0]);
  //     textIndexRef.current = 0;
  //   }
  // }, [children]);

  // const displayNextLetter = useCallback(() => {
  //   setTextToDisplay((prev) => `${prev}${children[textIndexRef.current]}`);
  //   textIndexRef.current += 1;

  //   if (textIndexRef.current < children.length && !showWholeText) {
  //     window.setTimeout(() => {
  //       displayNextLetter();
  //     }, timeToRevealNextLetter);
  //   }
  // }, [children, timeToRevealNextLetter, showWholeText]);

  // useEffect(() => {
  //   if (!showWholeText) {
  //     if (textIndexRef.current + 1 < children.length) {
  //       displayNextLetter();
  //     }
  //   } else {
  //     setTextToDisplay(children);
  //   }
  // }, [displayNextLetter, children, showWholeText]);

  // useEffect(() => {
  //   console.log({ textToDisplay });
  // }, [textToDisplay]);

  // return <StyledCharacterText>{textToDisplay}</StyledCharacterText>;
  return <StyledCharacterText>{children}</StyledCharacterText>;
};

export default TextExpander;
