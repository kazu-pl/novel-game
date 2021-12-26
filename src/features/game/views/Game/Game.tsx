import { fetchAct, selectAct } from "features/game/store/gameSlice";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import { useEffect } from "react";
import Box from "components/Box";
import { Spin } from "antd";
import { StyledLoadingErrorText, StyledLoadingText } from "./Game.styled";
import GameEngine from "./GameEngine";
import { ActiveView } from "pages/game";

export interface GameProps {
  actIdToFetch?: string | null;
  showActTitleOnEnter?: boolean;
  setActiveView: React.Dispatch<React.SetStateAction<ActiveView>>;
  setFirstActToFetchId: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  setShowActTitleOnEnter: React.Dispatch<React.SetStateAction<boolean>>;
}

const Game = ({
  actIdToFetch,
  showActTitleOnEnter,
  setShowActTitleOnEnter,
  setFirstActToFetchId,
  setActiveView,
}: GameProps) => {
  const dispatch = useAppDispatch();
  const actData = useAppSelector(selectAct);

  useEffect(() => {
    if (actIdToFetch) {
      // fetch act but only if actIdToFetch is passed (it will be passed only when starting new game or load game. After game is finished no actIdToFetch will be passed)
      dispatch(fetchAct(actIdToFetch));
      setFirstActToFetchId(null);
    }
  }, [dispatch, actIdToFetch, setFirstActToFetchId]);

  if (actData.isActLoading)
    return (
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
            <StyledLoadingText>Ładuję . . . </StyledLoadingText>
          </Box>
        </Box>
      </Box>
    );

  if (!actData.isActLoading && actData.act === null)
    return (
      <Box
        backgroundColor="black"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <StyledLoadingErrorText>Wystapił błąd.</StyledLoadingErrorText>
      </Box>
    );

  // here for a short while actData is still not null because it's still being assigned to redux store but it will exist here so just because of that I check once again if actData is null to return black page before act will load in redux and the real Game will appear
  if (actData === null) {
    return (
      <Box
        backgroundColor="black"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      ></Box>
    );
  }
  return (
    <GameEngine
      gameData={actData.act!}
      showActTitleOnEnter={showActTitleOnEnter}
      setActiveView={setActiveView}
      setShowActTitleOnEnter={setShowActTitleOnEnter}
    />
  );
};

export default Game;
