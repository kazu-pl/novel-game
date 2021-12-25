import { Button, Typography } from "antd";
import ArrowLeftOutlined from "@ant-design/icons";
import GameMenuLayout from "layouts/GameMenuLayout";

const { Paragraph } = Typography;

const tempGameSaves = [
  { data: "2021-11-12", act: "1" },
  { data: "2021-11-14", act: "1" },
  { data: "2021-11-15", act: "2" },
  { data: "2021-11-22", act: "4" },
];

export interface LoadGameProps {
  goBack: () => void;
}

const GameLoad = ({ goBack }: LoadGameProps) => {
  return (
    <GameMenuLayout>
      <Paragraph style={{ color: "white" }}>
        Wybierz zapis z gry wczytaj grę
      </Paragraph>
      <ArrowLeftOutlined />

      {tempGameSaves.map((save) => (
        <div
          key={save.data}
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            marginTop: 4,
            marginBottom: 4,
            padding: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p>Data: {save.data}</p>
            <p>Act: {save.act}</p>
          </div>
          <Button
          // onClick={() => setGameSave("some_data")}
          >
            Load
          </Button>
        </div>
      ))}
      <Button onClick={() => goBack()}>Wstecz</Button>
    </GameMenuLayout>
  );
};

export default GameLoad;
