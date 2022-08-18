import styled from "styled-components";

const Wrapper = styled.footer`
    height: 2rem;
    font-size: 0.75rem;
    text-align: center;

    background-color: black;
    color: white;

    position: absolute;
    bottom: 0;
    width: 100%;

    display: grid;
    align-items: center;
    justify-items: center;
`

const Footer = () => {
    return(
        <Wrapper>
            Hecho con ❤️ por Pedro Yáñez y Hernán Urzúa
        </Wrapper>
    )
};

export default Footer;