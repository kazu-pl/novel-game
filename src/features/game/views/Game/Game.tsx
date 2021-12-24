import { fetchAct } from "features/game/store/gameSlice";
import { useAppDispatch } from "common/store/hooks";

interface GameSave {}

export interface GameProps {
  gameSave?: GameSave;
}

const Game = ({}: GameProps) => {
  const dispatch = useAppDispatch();

  const handleStartNewGame = () => {
    dispatch(fetchAct("start"));
  };

  return <div> game</div>;
};

export default Game;
