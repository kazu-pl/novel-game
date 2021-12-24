import type { NextPage } from "next";
import { useState } from "react";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";

import Game from "features/game/views/Game";
import GameLoad from "features/game/views/GameLoad";
import GameMenu from "features/game/views/GameMenu";

export type ActiveView = "menu" | "load" | "game";

const GameMenuPage: NextPage = () => {
  const [activeView, setActiveView] = useState<ActiveView>("menu");

  return (
    <>
      <HeadDecorator title="Time In My Hands" description="Strona gry" />

      <PrivateRoute>
        {activeView === "menu" && <GameMenu setActiveView={setActiveView} />}
        {activeView === "load" && (
          <GameLoad goBack={() => setActiveView("menu")} />
        )}
        {activeView === "game" && <Game />}
      </PrivateRoute>
    </>
  );
};

export default GameMenuPage;
