import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "common/store/hooks";
import {
  deleteActData,
  resetCurrentDialogIndex,
  resetCurrentSceneIndex,
  selectAct,
  setIsTextRevealed,
} from "features/game/store/gameSlice";

export interface EndGameScreenWrapperProps {
  onRedirectToMenu?: () => void;
  redirectAfterTime?: number;
  children: React.ReactNode;
}

const EndGameScreenWrapper = ({
  onRedirectToMenu,
  children,
  redirectAfterTime = 8,
}: EndGameScreenWrapperProps) => {
  const dispatch = useAppDispatch();
  const actData = useAppSelector(selectAct);

  useEffect(() => {
    !!actData.act &&
      setTimeout(() => {
        dispatch(deleteActData());
        onRedirectToMenu && onRedirectToMenu();
        dispatch(resetCurrentDialogIndex());
        dispatch(resetCurrentSceneIndex());
        dispatch(setIsTextRevealed(false));
      }, redirectAfterTime * 1000);
  }, [redirectAfterTime, onRedirectToMenu, dispatch, actData.act]);

  return <>{children}</>;
};

export default EndGameScreenWrapper;
