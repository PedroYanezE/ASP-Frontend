import styled from 'styled-components'

const Wrapper = styled.div`
    background-color: black;
    display: grid;
    align-items: center;
    justify-items: center;
    height: 6rem;
`

const Logo = styled.span`
    color: white;
    font-size: 2rem;
    font-weight: 300;
    width: 4rem;
    text-align: center;
`

const Header = () => {
    return(
        <Wrapper>
            <Logo>
                S E A D
            </Logo>
        </Wrapper>
    )
}

export default Header