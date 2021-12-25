import Box from "components/Box";
import {
  StyledActTitle,
  StyledBgImg,
  StyledCharacterImg,
  StyledDialogTextWrapper,
  StyledCharacterNameWrapper,
  StyledCharacterTextWrapper,
  StyledCharacterText,
} from "./GameEngine.styled";

import { ActExtended } from "types/novel-server.types";
import { useEffect, useLayoutEffect, useState } from "react";
import { API_URL } from "common/constants/env";
import { ActiveView } from "pages/game";
import {
  DownloadOutlined,
  MenuFoldOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";

const actTitleAnimationDuration = 6;

export interface GameEngineProps {
  gameData: ActExtended;
  showActTitleOnEnter?: boolean;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
}

const GameEngine = ({
  gameData,
  showActTitleOnEnter = true,
  setActiveView,
}: GameEngineProps) => {
  const [isGameBoardVisible, setIsGameBoardVisible] = useState(false);

  useLayoutEffect(() => {
    if (!showActTitleOnEnter) setIsGameBoardVisible(true);
  }, [showActTitleOnEnter]);

  useEffect(() => {
    if (!isGameBoardVisible && showActTitleOnEnter) {
      setTimeout(() => {
        setIsGameBoardVisible(true);
      }, actTitleAnimationDuration * 1000);
    }
  }, [isGameBoardVisible, showActTitleOnEnter]);

  if (!isGameBoardVisible)
    return (
      <Box
        backgroundColor="black"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <StyledActTitle $animationDuration={actTitleAnimationDuration}>
          {gameData.title}
        </StyledActTitle>
      </Box>
    );

  return (
    <Box position="relative" overflow="hidden" height="100vh">
      <StyledBgImg
        src={`${API_URL + gameData.scenes[0].bgImg.link}`}
        alt="preview background image"
        layout="fill"
      />
      {gameData.scenes[0].dialogs[0].charactersOnScreen.map((character) => (
        <StyledCharacterImg
          src={API_URL + character.imgUrl}
          alt={character.name}
          left={character.leftPosition}
          zIndex={character.zIndex}
          key={character.characterId}
        />
      ))}

      <StyledDialogTextWrapper>
        <StyledCharacterNameWrapper>
          {gameData.scenes[0].dialogs[0].characterSayingText}

          <Box position="absolute" right={0} top={0}>
            <Box marginRight={10} display="inline-flex">
              <Tooltip title="Zapisz obecny stan gry">
                <Button
                  shape="circle"
                  size="small"
                  icon={<SaveOutlined />}
                  onClick={() => alert("zapisano!")}
                />
              </Tooltip>
            </Box>
            <Box marginRight={10} display="inline-flex">
              <Tooltip title="Wczytaj grę">
                <Button
                  shape="circle"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => setActiveView("load")}
                />
              </Tooltip>
            </Box>

            <Box marginRight={10} display="inline-flex">
              <Tooltip title="Wyjdź do menu">
                <Button
                  shape="circle"
                  size="small"
                  icon={<MenuFoldOutlined />}
                  onClick={() => setActiveView("menu")}
                />
              </Tooltip>
            </Box>
          </Box>
        </StyledCharacterNameWrapper>

        <StyledCharacterTextWrapper>
          <StyledCharacterText>
            {gameData.scenes[0].dialogs[0].text}
          </StyledCharacterText>
        </StyledCharacterTextWrapper>
      </StyledDialogTextWrapper>
    </Box>
  );
};

export default GameEngine;
