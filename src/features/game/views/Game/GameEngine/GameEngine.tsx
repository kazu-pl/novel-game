import Box from "components/Box";
import {
  StyledGameWrapper,
  StyledActTitle,
  StyledBgImg,
  StyledCharacterImg,
  StyledDialogTextWrapper,
  StyledCharacterNameWrapper,
  StyledCharacterTextWrapper,
  StyledEndGameScreenWrapper,
  StyledEndGameText,
} from "./GameEngine.styled";

import { ActExtended } from "types/novel-server.types";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { API_URL } from "common/constants/env";
import { ActiveView } from "pages/game";
import {
  DownloadOutlined,
  MenuFoldOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, message } from "antd";
import TextExpander from "./components/TextExpander";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import {
  fetchAct,
  increaseCurrentDialogIndex,
  increaseCurrentSceneIndex,
  resetCurrentDialogIndex,
  resetCurrentSceneIndex,
  selectCurrentDialogIndex,
  selectCurrentSceneIndex,
} from "features/game/store/gameSlice";
import EndGameScreenWrapper from "./components/EndGameScreenWrapper";

const actTitleAnimationDuration = 6;

export interface GameEngineProps {
  gameData: ActExtended;
  showActTitleOnEnter?: boolean;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
  setShowActTitleOnEnter: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameEngine = ({
  gameData,
  showActTitleOnEnter = true,
  setActiveView,
  setShowActTitleOnEnter,
}: GameEngineProps) => {
  const dispatch = useAppDispatch();
  const currentDialogIndex = useAppSelector(selectCurrentDialogIndex);
  const currentSceneIndex = useAppSelector(selectCurrentSceneIndex);
  const [isGameEnded, setIsGameEnded] = useState(false);

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

  useEffect(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const changeGameProgress = useCallback(
    (e: MouseEvent) => {
      if (
        currentDialogIndex + 1 <
        gameData.scenes[currentSceneIndex].dialogs.length
      ) {
        // still the same dialog array, just another dialog
        dispatch(increaseCurrentDialogIndex());
      } else {
        if (currentSceneIndex + 1 < gameData.scenes.length) {
          // next scene
          dispatch(resetCurrentDialogIndex());
          dispatch(increaseCurrentSceneIndex());
        } else {
          // need to change act / end game
          if (gameData.type !== "end" && gameData.nextAct) {
            // fetch next act
            dispatch(fetchAct(gameData.nextAct));
            dispatch(resetCurrentDialogIndex());
            dispatch(resetCurrentSceneIndex());
            setShowActTitleOnEnter(true);
          } else if (gameData.type !== "end" && !gameData.nextAct) {
            // there is no next act but game is not ended yet
            message.info(
              "Dotarłeś do końca aktualnie dostępnej historii! Oczekuj na kolejną część. Nie zapomnij zapisać stan gry!"
            );
          } else {
            setIsGameEnded(true);
            window.removeEventListener("click", changeGameProgress);
            // end game here
          }
        }
      }
    },
    [
      dispatch,
      currentDialogIndex,
      currentSceneIndex,
      gameData.scenes,
      gameData.nextAct,
      gameData.type,
      setShowActTitleOnEnter,
    ]
  );

  useEffect(() => {
    if (isGameBoardVisible) {
      // prevents changing dialongs and scenes when click durring showing act title
      window.addEventListener("click", changeGameProgress);
    }

    return () => {
      window.removeEventListener("click", changeGameProgress);
    };
  }, [changeGameProgress, isGameBoardVisible]);

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
    <StyledGameWrapper>
      <StyledBgImg
        src={`${API_URL + gameData.scenes[0].bgImg.link}`}
        alt="preview background image"
        layout="fill"
      />
      {gameData?.scenes[currentSceneIndex]?.dialogs[
        currentDialogIndex
      ]?.charactersOnScreen?.map((character) => (
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
          {
            gameData?.scenes[currentSceneIndex]?.dialogs[currentDialogIndex]
              ?.characterSayingText
          }

          <Box
            position="absolute"
            right={0}
            top="50%"
            transform="translateY(-50%)"
          >
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
          <TextExpander>
            {
              gameData?.scenes[currentSceneIndex]?.dialogs[currentDialogIndex]
                ?.text
            }
          </TextExpander>
        </StyledCharacterTextWrapper>
      </StyledDialogTextWrapper>

      {isGameEnded && (
        <EndGameScreenWrapper
          redirectAfterTime={12}
          onRedirectToMenu={() => setActiveView("menu")}
        >
          <StyledEndGameScreenWrapper animationDuration={6}>
            <StyledEndGameText $animationDelay={6} $animationDuration={6}>
              Dziękuję za grę!
            </StyledEndGameText>
          </StyledEndGameScreenWrapper>
        </EndGameScreenWrapper>
      )}
    </StyledGameWrapper>
  );
};

export default GameEngine;
