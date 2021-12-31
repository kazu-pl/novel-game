import { StyledButton } from "./GameMenu.styled";
import { ActiveView } from "pages/game";
import { useRouter } from "next/router";
import { PATHS_DASHBOARD } from "common/constants/paths";
import GameMenuLayout from "layouts/GameMenuLayout";
import {
  deleteActData,
  resetCurrentDialogIndex,
  resetCurrentSceneIndex,
  selectAct,
  setIsCachedImgsLoaded,
  setIsTextRevealed,
} from "features/game/store/gameSlice";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import { Modal, message } from "antd";
import { useState } from "react";
import { saveGame } from "features/game/store/gameSlice";

export interface GameLoadProps {
  setActiveView: (view: ActiveView) => void;
  onResumeBtnClick: () => void;
  onStartNewGameClick: () => void;
}

const GameMenu = ({
  setActiveView,
  onResumeBtnClick,
  onStartNewGameClick,
}: GameLoadProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const actData = useAppSelector(selectAct);

  const [isStartNewGameModalVisible, setIsStartNewGameModalVisible] =
    useState(false);

  const handleExit = () => {
    dispatch(deleteActData());
    router.push(PATHS_DASHBOARD.DASHBOARD);
    dispatch(setIsTextRevealed(false));
    dispatch(resetCurrentDialogIndex());
    dispatch(resetCurrentSceneIndex());
    dispatch(setIsCachedImgsLoaded(false));
  };

  const saveLatestGame = async () => {
    if (!actData.act) return;

    try {
      await dispatch(saveGame());
      message.success("Zapisano!");
    } catch (err) {
      message.error("Wystąpił błąd podczas próby zapisy gry!");
    }
  };

  return (
    <GameMenuLayout>
      {actData.act && (
        <StyledButton
          type="text"
          block
          size="large"
          onClick={(e) => {
            e.stopPropagation();
            // e.stopPropagation(); prevents event bubbling, without this after entering game again, you would see next dialog. Found here:
            // https://stackoverflow.com/questions/27625584/attaching-click-event-listener-in-onclick-immediately-calls-that-event-listener
            onResumeBtnClick();
            setActiveView("game");
          }}
        >
          Wznów
        </StyledButton>
      )}
      <StyledButton
        type="text"
        block
        size="large"
        onClick={() => {
          if (actData.act !== null) {
            setIsStartNewGameModalVisible(true);
          } else {
            onStartNewGameClick();
            setActiveView("game");
            dispatch(setIsTextRevealed(false));
            dispatch(resetCurrentDialogIndex());
            dispatch(resetCurrentSceneIndex());
            dispatch(setIsCachedImgsLoaded(false));
          }
        }}
      >
        Nowa gra
      </StyledButton>

      <StyledButton
        type="text"
        block
        size="large"
        onClick={() => setActiveView("load")}
      >
        wczytaj
      </StyledButton>
      <StyledButton
        type="text"
        block
        size="large"
        disabled={!actData.act}
        onClick={saveLatestGame}
      >
        Zapisz
      </StyledButton>
      <StyledButton type="text" block size="large" onClick={handleExit}>
        wyjdź
      </StyledButton>

      <Modal
        title="Rozpocznij nową grę"
        visible={isStartNewGameModalVisible}
        onOk={() => {
          onStartNewGameClick();
          setActiveView("game");
          dispatch(resetCurrentDialogIndex());
          dispatch(resetCurrentSceneIndex());
          dispatch(setIsTextRevealed(false));
          dispatch(setIsCachedImgsLoaded(false));
        }}
        onCancel={() => setIsStartNewGameModalVisible(false)}
      >
        <p>
          Jesteś w trakcie rozgrywki. Jeśli teraz rozpoczniesz nową grę to
          stracisz niezapisay stan gry. Czy chcesz kontynuowac?
        </p>
      </Modal>
    </GameMenuLayout>
  );
};

export default GameMenu;
