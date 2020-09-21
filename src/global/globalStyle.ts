import styled, { createGlobalStyle } from 'styled-components';

interface DividerInterface{
    height: string
}

interface ButtonInterface{
    color: string
}

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        font-size: 16;
        font-family: 'Roboto', sans-serif;
    }

    html, body, #root {
        height: 100%;
    }

    :root{
        --primaryColor: #000051;
        --secondaryColor: white;
    }
`;

export const Input = styled.input`
    padding-left: 5px;
    font-size: 16px;
    width: 100%;
    height: 50px;
    border: none;
`;

export const Submit = styled.button`
    width: 100%;
    height: 45px;
    border: none;
    color: var(--secondaryColor);
    background-color: var(--buttonPrimary);
    font-weight: bold;
    cursor: pointer;
`;

export const Divider = styled.div<DividerInterface>`
    height: ${props => props.height};
`;

export const Button = styled.button`
    width: 100%;
    height: 45px;
    border: none;
    font-weight: bold;
    color: var(--secondaryColor);
    background-color: ${props => props.color === 'info' ? 'var(--buttonInfo)' : 'var(--buttonPrimary)'};
    cursor: pointer;
`;