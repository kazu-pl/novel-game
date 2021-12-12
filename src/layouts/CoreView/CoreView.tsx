import {
  StyledCorePageWrapper,
  StyledContentWrapper,
  StyledSectionWrapper,
} from "./CoreView.styled";

import { Typography } from "antd";

const { Title, Paragraph } = Typography;

export interface CoreViewProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const CoreView = ({ children, title, description }: CoreViewProps) => {
  return (
    <StyledCorePageWrapper>
      <StyledContentWrapper>
        <StyledSectionWrapper>
          <Title level={1}>{title}</Title>
        </StyledSectionWrapper>
        {description && (
          <StyledSectionWrapper>
            <Paragraph>{description}</Paragraph>
          </StyledSectionWrapper>
        )}

        {children}
      </StyledContentWrapper>
    </StyledCorePageWrapper>
  );
};

export default CoreView;
