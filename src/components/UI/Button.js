// @flow

import React from 'react';
import styled from 'styled-components/native'

type ButtonProps = {};

const Button = (props: ButtonProps) => (
    <ButtonWrap>
        <B onPress={props.onPress}>
            <ButtonText>{props.children}</ButtonText>
        </B>
    </ButtonWrap>
);

const B = styled.TouchableOpacity`
    background-color: #007D5F;
    padding: 5px 10px;
    border-radius: 3px;
`;

const ButtonText = styled.Text`
    color: white;
    font-weight: bold
`;

const ButtonWrap = styled.View`
    flex-direction: row;
`;

export default Button;