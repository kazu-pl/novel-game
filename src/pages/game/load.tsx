import type { NextPage } from "next";
import HeadDecorator from "components/HeadDecorator";
import PrivateRoute from "common/router/PrivateRoute";
import GameMenuLayout from "layouts/GameMenuLayout";
import Link from "next/link";
import { PATHS_GAME } from "common/constants/paths";
import styled from "styled-components";
import { ArrowLeftOutlined } from "@ant-design/icons";

const StyledAnchor = styled.a`
  color: white;
`;

const GameLoadPage: NextPage = () => {
  return (
    <>
      <HeadDecorator
        title="Time In My Hands - Settings"
        description="Strona ustawień gry"
      />

      <PrivateRoute>
        <GameMenuLayout>
          <p>zaladuj grę</p>
          <Link href={PATHS_GAME.GAME_MAIN_MENU} passHref>
            <StyledAnchor>
              <span>
                <ArrowLeftOutlined />
              </span>
              Wstecz
            </StyledAnchor>
          </Link>
        </GameMenuLayout>
      </PrivateRoute>
    </>
  );
};

export default GameLoadPage;
