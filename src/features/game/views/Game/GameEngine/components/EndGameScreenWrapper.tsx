import { useEffect } from "react";

import { useAppDispatch } from "common/store/hooks";
import { deleteActData } from "features/game/store/gameSlice";

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

  useEffect(() => {
    setTimeout(() => {
      dispatch(deleteActData());
      onRedirectToMenu && onRedirectToMenu();
    }, redirectAfterTime * 1000);
  }, [redirectAfterTime, onRedirectToMenu, dispatch]);

  return <>{children}</>;
};

export default EndGameScreenWrapper;
