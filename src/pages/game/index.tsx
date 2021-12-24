import type { NextPage } from "next";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";
import styled, { css } from "styled-components";
import { Button } from "antd";
import { useRouter } from "next/router";
import { PATHS_DASHBOARD, PATHS_GAME } from "common/constants/paths";
import GameMenuLayout from "layouts/GameMenuLayout";
import { fetchAct } from "features/game/store/gameSlice";
import Game from "features/game/views/Game";
import { useState } from "react";

const ButtonStyles = css`
  && {
    border: none;
    color: white;
  }

  &:hover {
    border: none;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.3)
    );
  }
`;

export const StyledButton = styled(Button)`
  ${ButtonStyles};
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.4;
    `}
`;

const GameMenuPage: NextPage = () => {
  const router = useRouter();

  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <>
      <HeadDecorator title="Time In My Hands" description="Strona gry" />

      <PrivateRoute>
        <GameMenuLayout>
          <StyledButton
            type="text"
            block
            size="large"
            onClick={() => setIsGameOpen(true)}
          >
            Wznów
          </StyledButton>
          <StyledButton
            type="text"
            block
            size="large"
            onClick={() => setIsGameOpen(true)}
          >
            Nowa gra
          </StyledButton>
          <StyledButton
            type="text"
            block
            size="large"
            onClick={() => router.push(PATHS_GAME.LOADGAME)}
          >
            wczytaj
          </StyledButton>
          <StyledButton
            type="text"
            block
            size="large"
            disabled
            ghost
            onClick={() => console.log("zapisano")}
          >
            Zapisz
          </StyledButton>
          <StyledButton
            type="text"
            block
            size="large"
            onClick={() => router.push(PATHS_DASHBOARD.DASHBOARD)}
          >
            wyjdź
          </StyledButton>
        </GameMenuLayout>
      </PrivateRoute>
    </>
  );
};

export default GameMenuPage;
