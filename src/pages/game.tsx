import type { NextPage } from "next";
import { useEffect, useState } from "react";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";

import Game from "features/game/views/Game";
import GameLoad from "features/game/views/GameLoad";
import GameMenu from "features/game/views/GameMenu";

export type ActiveView = "menu" | "load" | "game";

const GameMenuPage: NextPage = () => {
  const [activeView, setActiveView] = useState<ActiveView>("menu");
  const [showActTitleOnEnter, setShowActTitleOnEnter] = useState(true);
  const [firstActToFetchId, setFirstActToFetchId] = useState<
    string | null | undefined
  >(null);

  useEffect(() => {
    return () => {
      if (!!document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  return (
    <>
      <HeadDecorator title="Time In My Hands" description="Strona gry" />

      <PrivateRoute>
        {activeView === "menu" && (
          <GameMenu
            setActiveView={setActiveView}
            onResumeBtnClick={() => {
              setShowActTitleOnEnter(false);
            }}
            onStartNewGameClick={() => {
              setFirstActToFetchId("start");
              setShowActTitleOnEnter(true);
            }}
          />
        )}
        {activeView === "load" && (
          <GameLoad
            setActiveView={setActiveView}
            setActIdToLoad={setFirstActToFetchId}
          />
        )}
        {activeView === "game" && (
          <Game
            showActTitleOnEnter={showActTitleOnEnter}
            setActiveView={setActiveView}
            setFirstActToFetchId={setFirstActToFetchId}
            actIdToFetch={firstActToFetchId}
            setShowActTitleOnEnter={setShowActTitleOnEnter}
          />
        )}
      </PrivateRoute>
    </>
  );
};

export default GameMenuPage;
