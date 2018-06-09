import styled from 'styled-components/native'
import { colors } from '../constants/styleGuide';

export const Input = styled.TextInput`
    height: 25px;
    background-color: transparent;
    borderBottomColor: #333;
    borderBottomWidth: 1.25;
    color: black;
    padding: 0;
    margin-bottom: 5px;
`;

export const Label = styled.Text`
    color: black;
    font-family: 'OpenSans-Bold';
    font-size: 12px;
    margin-bottom: 5px;
`;

export const InputError = styled.Text`
    font-size: 10px;
    color: tomato;
`;

export const InputWrap = styled.View`
    margin-bottom: 10px;
`;

