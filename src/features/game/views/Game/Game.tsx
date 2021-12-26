import {
  fetchAct,
  selectAct,
  selectIsCachedImgsLoaded,
  setIsCachedImgsLoaded,
} from "features/game/store/gameSlice";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import { useEffect, useRef } from "react";
import Box from "components/Box";
import { Spin } from "antd";
import { StyledLoadingErrorText, StyledLoadingText } from "./Game.styled";
import GameEngine from "./GameEngine";
import { ActiveView } from "pages/game";
import getUniqueListOfActImgs from "features/game/store/getUniquieListOfActImgs";
import { API_URL } from "common/constants/env";

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
  const imgsWrapperRef = useRef<HTMLDivElement | null>(null);
  const isCachedImgsListLoaded = useAppSelector(selectIsCachedImgsLoaded);

  useEffect(() => {
    if (isCachedImgsListLoaded) return;

    const checkIfCachingImagesFetched = () => {
      if (!imgsWrapperRef || !imgsWrapperRef.current) return;

      const isImgsListLoaded: boolean = Array.from(
        imgsWrapperRef.current.children
      ).reduce(
        (_, current) => (current as HTMLImageElement).complete,
        false as boolean
      );

      if (isImgsListLoaded) {
        dispatch(setIsCachedImgsLoaded(true));
        window.clearInterval(interval);
      }
    };

    const interval = window.setInterval(checkIfCachingImagesFetched, 500);

    return () => window.clearInterval(interval);
  }, [isCachedImgsListLoaded, dispatch]);

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
            <StyledLoadingText>Ładuję rozdział . . . </StyledLoadingText>
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

  if (!isCachedImgsListLoaded)
    return (
      <>
        {/* rendering imgs for all images that will be avaliable in current act BEFORE act starts allows to fetch then before act so when act starts browser will serve then from cache WITHOUT ANY DELAY. This img list will make img tags in DOM only for the loading time being. After all images are loaded, they will be removed. */}
        <div style={{ display: "none" }} ref={imgsWrapperRef}>
          {getUniqueListOfActImgs(actData.act!).map((img) => (
            // eslint-disable-next-line
            <img
              src={API_URL + img}
              alt={img}
              key={img}
              width={0}
              height={0}
              style={{ width: 0, height: 0 }}
            />
          ))}
        </div>

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
              <StyledLoadingText>Ładuję zdjęcia . . . </StyledLoadingText>
            </Box>
          </Box>
        </Box>
      </>
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
