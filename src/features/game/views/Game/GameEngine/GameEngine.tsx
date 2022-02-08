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
  saveGame,
  selectCurrentDialogIndex,
  selectCurrentSceneIndex,
  selectIsTextRevealed,
  setIsCachedImgsLoaded,
  setIsTextRevealed,
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
  const isTextRevealed = useAppSelector(selectIsTextRevealed);
  const [isGameBoardVisible, setIsGameBoardVisible] = useState(false);

  useLayoutEffect(() => {
    if (!showActTitleOnEnter) setIsGameBoardVisible(true);
  }, [showActTitleOnEnter]);

  useEffect(() => {
    if (!isGameBoardVisible && showActTitleOnEnter) {
      setTimeout(() => {
        setIsGameBoardVisible(true);
      }, (actTitleAnimationDuration + 1) * 1000);
    }
  }, [isGameBoardVisible, showActTitleOnEnter]);

  useEffect(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const changeGameProgress = useCallback(() => {
    if (
      currentDialogIndex + 1 <
      gameData.scenes[currentSceneIndex].dialogs.length
    ) {
      // next dialog from dialogs array
      if (!isTextRevealed) {
        // first reveal whole text before changing to next dialog
        dispatch(setIsTextRevealed(true));
      } else {
        // still the same dialog array, just another dialog
        dispatch(increaseCurrentDialogIndex());
        dispatch(setIsTextRevealed(false));
      }
    } else {
      if (currentSceneIndex + 1 < gameData.scenes.length) {
        // next scene

        if (!isTextRevealed) {
          dispatch(setIsTextRevealed(true));
        } else {
          dispatch(resetCurrentDialogIndex());
          dispatch(increaseCurrentSceneIndex());
          dispatch(setIsTextRevealed(false));
        }
      } else {
        // need to change act / end game
        if (gameData.type !== "end" && gameData.nextAct) {
          // fetch next act

          if (!isTextRevealed) {
            // dialog is still revealing so first reveal it
            dispatch(setIsTextRevealed(true));
          } else {
            // and then fetch next act
            dispatch(fetchAct(gameData.nextAct));
            dispatch(setIsCachedImgsLoaded(false));
            dispatch(resetCurrentDialogIndex());
            dispatch(resetCurrentSceneIndex());
            setShowActTitleOnEnter(true);
            dispatch(setIsTextRevealed(false));
          }
        } else if (gameData.type !== "end" && !gameData.nextAct) {
          // there is no next act but game is not ended yet
          message.info(
            "Dotarłeś do końca aktualnie dostępnej historii. Oczekuj na dalszą część. Nie zapomnij zapisać stan gry!"
          );
          if (!isTextRevealed) {
            dispatch(setIsTextRevealed(true));
          } else {
            dispatch(setIsTextRevealed(false));
          }

          window.removeEventListener("click", changeGameProgress);
        } else {
          // // end game here

          // you can't dispatch below actions here because for example currentDialogIndex in array dependency will change and game will get listener one more time. Those actions are dispatched in EndGameScreenWrapper
          // // dispatch(setIsTextRevealed(false));
          // // dispatch(resetCurrentDialogIndex());
          // // dispatch(resetCurrentSceneIndex());

          if (!isTextRevealed) {
            // text is still not fully revealed so first reveal it
            dispatch(setIsTextRevealed(true));
          } else {
            // and then end game and remove listener
            setIsGameEnded(true);
            window.removeEventListener("click", changeGameProgress);
          }
        }
      }
    }
  }, [
    dispatch,
    currentDialogIndex,
    currentSceneIndex,
    gameData.scenes,
    gameData.nextAct,
    gameData.type,
    setShowActTitleOnEnter,
    isTextRevealed,
  ]);

  useEffect(() => {
    if (!isGameEnded && isGameBoardVisible) {
      // prevents changing dialongs and scenes when click durring showing act title or when game ended
      window.addEventListener("click", changeGameProgress);
    }

    return () => {
      window.removeEventListener("click", changeGameProgress);
    };
  }, [changeGameProgress, isGameBoardVisible, isGameEnded]);

  const saveLatestGame: React.MouseEventHandler<HTMLElement> = async (e) => {
    e.stopPropagation();
    if (!gameData) return;

    message.info("Trwa zapisywanie...");
    try {
      await dispatch(saveGame());
      message.success("Zapisano!");
    } catch (err) {
      message.error("Wystąpił błąd podczas próby zapisy gry!");
    }
  };

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
        src={`${API_URL + gameData.scenes[currentSceneIndex].bgImg.link}`}
        alt="preview background image"
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
                  onClick={saveLatestGame}
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

      {isGameEnded && isTextRevealed && (
        <EndGameScreenWrapper
          redirectAfterTime={11}
          onRedirectToMenu={() => setActiveView("menu")}
        >
          <StyledEndGameScreenWrapper animationDuration={4}>
            <StyledEndGameText $animationDelay={5} $animationDuration={5}>
              Koniec.
            </StyledEndGameText>
          </StyledEndGameScreenWrapper>
        </EndGameScreenWrapper>
      )}
    </StyledGameWrapper>
  );
};

export default GameEngine;
