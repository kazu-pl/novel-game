import {
  StyledWrapper,
  StyledBgImg,
  StyledLoadingText,
  StyledMenuLayoutWrapper,
} from "./GameMenuLayout.styled";
import Box from "components/Box";
import { Spin, Typography } from "antd";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "common/store/hooks";
import {
  selectIsGameMenuBgLoaded,
  setIsGameMenuBgLoaded,
} from "features/game/store/gameSlice";
const { Title } = Typography;

export interface GameMenuLayoutProps {
  children?: React.ReactNode;
}

const GameMenuLayout = ({ children }: GameMenuLayoutProps) => {
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const dispatch = useDispatch();
  const isBgImgLoaded = useAppSelector(selectIsGameMenuBgLoaded);

  useEffect(() => {
    if (isBgImgLoaded) return;

    const checkIfbgImgLoaded = () => {
      if (!bgImgRef.current) return;

      if (bgImgRef.current.complete) {
        dispatch(setIsGameMenuBgLoaded(true));
        window.clearInterval(interval);
      }
    };

    const interval = window.setInterval(checkIfbgImgLoaded, 500);

    return () => window.clearInterval(interval);
  }, [dispatch, isBgImgLoaded]);

  if (!isBgImgLoaded)
    return (
      <>
        <Box backgroundColor="black" position="relative" minHeight="100vh">
          <Box
            position="absolute"
            bottom={20}
            left={50}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Spin size="large" />
            <Box marginLeft={24}>
              <StyledLoadingText>Ładuję grę . . . </StyledLoadingText>
            </Box>
          </Box>
        </Box>

        {/* eslint-disable-next-line */}
        <img
          src="/gameMenuBg.jpg"
          alt="background image for menu"
          ref={bgImgRef}
          width={0}
          height={0}
          style={{ width: 0, height: 0, display: "none" }}
        />
      </>
    );

  return (
    <StyledWrapper>
      <StyledBgImg src="/gameMenuBg.jpg" alt="alt" />
      <StyledMenuLayoutWrapper>
        <Box
          padding="16px"
          backgroundImage="linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))"
          boxShadow="0 0 15px 1px black"
          borderRadius={10}
          color="white"
          textAlign="center"
          maxHeight={"100%"}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Title
            level={2}
            style={{
              color: "white",
              textShadow: "5px 5px 3px black",
              userSelect: "none",
            }}
          >
            Time In My hands
          </Title>
          {children}
        </Box>
      </StyledMenuLayoutWrapper>
    </StyledWrapper>
  );
};

export default GameMenuLayout;
