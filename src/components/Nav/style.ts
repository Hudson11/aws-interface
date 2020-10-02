import styled from 'styled-components'


export const Container = styled.div`
    height: 80px;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    background-color: var(--primaryColor);
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const  NavBar = styled.nav`
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    ul {
        list-style: none;
    }
`;

export const  Logo = styled.div`
    display: flex;
    align-items: center;
    img{
        width: 60px;
    }
    strong{
        color: var(--secondaryColor);
        font-size: 20px;
    }
`;

export const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    label {
        color: white;
        margin-right: 5px;
    }   
    .p-button-secondary{
        background-color: transparent;
    }

    a {
        outline-style: none;
        text-decoration: none;
        color: white;
        margin-right: 20px;
    }
`;