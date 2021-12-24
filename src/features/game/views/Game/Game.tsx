import { fetchAct, selectAct } from "features/game/store/gameSlice";
import { useAppDispatch, useAppSelector } from "common/store/hooks";
import { useEffect } from "react";

interface GameSave {}

export interface GameProps {
  gameSave?: GameSave;
}

const Game = ({ gameSave }: GameProps) => {
  const dispatch = useAppDispatch();
  const actData = useAppSelector(selectAct);

  useEffect(() => {
    if (!actData.act) {
      if (gameSave) {
        //// download saved game
        // dispatch(fetchAct("start"));
      } else {
        // start new game
        dispatch(fetchAct("start"));
      }
    }
  }, [dispatch, gameSave, actData.act]);

  return <div> game</div>;
};

export default Game;
