import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import Box from "components/Box";

import {
  setCurrentSceneIndex,
  setCurrentDialogIndex,
  fetchGameSaves,
  selectGameSaves,
  deleteGameSave,
  setIsTextRevealed,
} from "features/game/store/gameSlice";
import GameMenuLayout from "layouts/GameMenuLayout";
import { ActiveView } from "pages/game";
import { useEffect, useState } from "react";
import { ExtendedGameSave } from "types/novel-server.types";
import {
  StyledSaveIconsWrapper,
  StyledSaveContentWrapper,
  StyledSaveWrapper,
  StyledParagraph,
  StyledSaveTextTitle,
} from "./GameLoad.styled";

export interface LoadGameProps {
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
  setActIdToLoad: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
}

const GameLoad = ({ setActiveView, setActIdToLoad }: LoadGameProps) => {
  const dispatch = useAppDispatch();
  const gameSaves = useAppSelector(selectGameSaves);

  const [gameSaveToDelete, setGameSaveToDelete] = useState<{
    id: string;
    actTitle: string;
    characterSayingText?: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        await dispatch(fetchGameSaves());
      } catch (error) {
        message.error("Wystąpił błąd podczas pobierania zapisów gry");
      }
    };
    fetch();
  }, [dispatch]);

  const handleLoadGame = (save: ExtendedGameSave) => {
    if (!save) return;

    setActIdToLoad(save.actId);
    dispatch(setCurrentSceneIndex(save.sceneIndex));
    dispatch(setCurrentDialogIndex(save.dialogIndex));
    setActiveView("game");
    dispatch(setIsTextRevealed(false));
  };

  const handleDeleteSave = async () => {
    try {
      await dispatch(deleteGameSave(gameSaveToDelete!.id));
      setGameSaveToDelete(null);
      dispatch(fetchGameSaves());
    } catch (error) {
      message.error("Wystąpił błąd podczas usuwania zapisu gry");
    }
  };

  return (
    <GameMenuLayout>
      <StyledParagraph>Zapisy z gry</StyledParagraph>

      {gameSaves.isLoading && (
        <Box marginBottom={8} marginTop={8}>
          <StyledParagraph>Loading . . .</StyledParagraph>
        </Box>
      )}

      {!gameSaves.isLoading &&
        (gameSaves.data === null || gameSaves.data.length === 0) && (
          <StyledParagraph>Brak zapisów gry</StyledParagraph>
        )}

      <Box maxHeight={500} height="100%" overflowY="auto" marginBottom={8}>
        {gameSaves.data?.map((save) => (
          <StyledSaveWrapper key={save._id}>
            <StyledSaveContentWrapper>
              <Box display="flex" justifyContent="space-between">
                <StyledParagraph>
                  <StyledSaveTextTitle>Title: </StyledSaveTextTitle>
                  {save.actTitle}
                </StyledParagraph>

                <StyledSaveIconsWrapper>
                  <Tooltip title="Wczytaj ten zapis">
                    <Button
                      onClick={() => handleLoadGame(save)}
                      shape="circle"
                      icon={<PlayCircleOutlined />}
                    />
                  </Tooltip>
                  <Box marginLeft={4}>
                    <Tooltip title="Usuń">
                      <Button
                        onClick={() =>
                          setGameSaveToDelete({
                            actTitle: save.actTitle,
                            characterSayingText: save.characterSayingText,
                            id: save._id,
                            text: save.text,
                          })
                        }
                        shape="circle"
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Box>
                </StyledSaveIconsWrapper>
              </Box>
              <StyledParagraph>
                <StyledSaveTextTitle>Postać: </StyledSaveTextTitle>
                {save.characterSayingText}
              </StyledParagraph>
              <StyledParagraph>
                <StyledSaveTextTitle>Tekst: </StyledSaveTextTitle>
                {save.text.length > 60
                  ? `${save.text.slice(0, 60)}...`
                  : save.text}
              </StyledParagraph>
            </StyledSaveContentWrapper>
          </StyledSaveWrapper>
        ))}
      </Box>
      <Button onClick={() => setActiveView("menu")}>Wstecz</Button>
      <Modal
        title="Usuń zapis gry"
        cancelText="Anuluj"
        visible={!!gameSaveToDelete}
        onOk={handleDeleteSave}
        onCancel={() => setGameSaveToDelete(null)}
      >
        <StyledParagraph $color="black">
          Czy na pewno usunąć poniższy zapis? Tej operacji nie można cofnąć.
        </StyledParagraph>
        {gameSaveToDelete && (
          <StyledSaveWrapper borderColor="dark">
            <StyledSaveContentWrapper>
              <StyledParagraph $color="black">
                <StyledSaveTextTitle $color="black">
                  Title:{" "}
                </StyledSaveTextTitle>
                {gameSaveToDelete.actTitle}
              </StyledParagraph>
              <StyledParagraph $color="black">
                <StyledSaveTextTitle $color="black">
                  Postać:{" "}
                </StyledSaveTextTitle>
                {gameSaveToDelete.characterSayingText}
              </StyledParagraph>
              <StyledParagraph $color="black">
                <StyledSaveTextTitle $color="black">
                  Tekst:{" "}
                </StyledSaveTextTitle>
                {gameSaveToDelete.text.length > 60
                  ? `${gameSaveToDelete.text.slice(0, 60)}...`
                  : gameSaveToDelete.text}
              </StyledParagraph>
            </StyledSaveContentWrapper>
          </StyledSaveWrapper>
        )}
      </Modal>
    </GameMenuLayout>
  );
};

export default GameLoad;
