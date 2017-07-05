import React from 'react';
import styled from 'styled-components';
import Wrapper from './Wrapper';
import TopImage from './TopImage.svg';
import Button from '../Button';

const Title = styled.h1`
  letter-spacing: 1px;
  font-weight: 400;
  margin: 0;
`;

const SubTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 100;
`;

const TopImageContainer = styled.div`
  margin: 1.5rem 0;
`;

const Jumbotron = () => (
  <Wrapper>
    <Title>Next Generation of API.</Title>
    <SubTitle>Create, edit and organize all data in Tables.</SubTitle>
    <TopImageContainer>
      <img src={TopImage} alt="APITable" />
    </TopImageContainer>
    <SubTitle>From Table → JSON</SubTitle>
    <br />
    <Button to="/tables">TRY IT OUT NOW!</Button>
  </Wrapper>
);

export default Jumbotron;