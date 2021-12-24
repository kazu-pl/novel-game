import { Button } from "antd";
import ArrowLeftOutlined from "@ant-design/icons";
import GameMenuLayout from "layouts/GameMenuLayout";

export interface LoadGameProps {
  goBack: () => void;
}

const GameLoad = ({ goBack }: LoadGameProps) => {
  return (
    <GameMenuLayout>
      <ArrowLeftOutlined />
      <p>Wczytaj grę</p>
      <Button onClick={() => goBack()}>Wstecz</Button>
    </GameMenuLayout>
  );
};

export default GameLoad;
