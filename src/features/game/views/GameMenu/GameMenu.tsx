import { StyledButton } from "./GameMenu.styled";
import { ActiveView } from "pages/game";
import { useRouter } from "next/router";
import { PATHS_DASHBOARD } from "common/constants/paths";
import GameMenuLayout from "layouts/GameMenuLayout";
import { deleteActData, selectAct } from "features/game/store/gameSlice";
import { useAppDispatch, useAppSelector } from "common/store/hooks";

export interface GameLoadProps {
  setActiveView: (view: ActiveView) => void;
}

const GameMenu = ({ setActiveView }: GameLoadProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const actData = useAppSelector(selectAct);

  const handleExit = () => {
    dispatch(deleteActData());
    router.push(PATHS_DASHBOARD.DASHBOARD);
  };

  return (
    <GameMenuLayout>
      {actData.act && (
        <StyledButton
          type="text"
          block
          size="large"
          onClick={() => setActiveView("game")}
        >
          Wznów
        </StyledButton>
      )}
      <StyledButton
        type="text"
        block
        size="large"
        onClick={() => setActiveView("game")}
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
        onClick={() => console.log("zapisano")}
      >
        Zapisz
      </StyledButton>
      <StyledButton type="text" block size="large" onClick={handleExit}>
        wyjdź
      </StyledButton>
    </GameMenuLayout>
  );
};

export default GameMenu;
