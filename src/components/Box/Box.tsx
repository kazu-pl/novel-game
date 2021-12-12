import { StyledBox } from "./Box.styled";

export interface BoxProps extends Omit<React.CSSProperties, "translate"> {
  children?: React.ReactNode;
}

const Box = ({ children, ...rest }: BoxProps) => {
  return <StyledBox styles={rest}>{children}</StyledBox>;
};

export default Box;
