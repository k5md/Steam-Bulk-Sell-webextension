import React from 'react';
import BootstrapCard  from 'react-bootstrap/Card';

const { Header, Body } = BootstrapCard;

export interface Props {
  title?: string;
  styles?: {
    container?: string;
    title?: string;
    body?: string;
  };
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({
  title,
  styles: {
    container: containerStyle = '',
    title: titleStyle = '',
    body: bodyStyle = '',
  } = {},
  children,
}) => (
  <BootstrapCard className={`card border-primary ${containerStyle}`}>
    <Header
      as="h3"
      className={`card-header font-weight-bold text-center bg-primary ${titleStyle}`}
    >
      {title}
    </Header>
    <Body className={`card-body ${bodyStyle}`}>
      {children}
    </Body>
  </BootstrapCard>
);

export default Card;
