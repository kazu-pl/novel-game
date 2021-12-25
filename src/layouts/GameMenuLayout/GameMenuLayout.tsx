import { StyledWrapper } from "./GameMenuLayout.styled";
import Box from "components/Box";
import { Typography } from "antd";
const { Title } = Typography;

export interface GameMenuLayoutProps {
  children?: React.ReactNode;
}

const GameMenuLayout = ({ children }: GameMenuLayoutProps) => {
  return (
    <StyledWrapper>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Box
          padding="16px"
          backgroundImage="linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))"
          boxShadow="0 0 15px 1px black"
          borderRadius={10}
          color="white"
        >
          <Title style={{ color: "white", textShadow: "5px 5px 3px black" }}>
            Time In My hands
          </Title>
          {children}
        </Box>
      </Box>
    </StyledWrapper>
  );
};

export default GameMenuLayout;
