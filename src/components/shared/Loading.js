import styled, { keyframes } from "styled-components";

const dotFlashing = keyframes`
    from {
        background-color: #000000;
    }

    to {
        background-color: #d4d4d4;
    }
`

const Loading = styled.div`
    position: relative;
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 5px;
    background-color: #000000;
    animation: ${dotFlashing} 1s infinite linear alternate;
    animation-delay: 0.5s;

    &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;

        left: -15px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: #000000;
        animation: ${dotFlashing} 1s infinite alternate;
        animation-delay: 0s;
    }

    &:after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;

        left: 15px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: #000000;
        animation: ${dotFlashing} 1s infinite alternate;
        animation-delay: 1s;
    }
`

const LoadingText = styled.p`
    margin: 0;
    margin-bottom: 1rem;
`

const Stage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
`

const LoadingComponent = ({status}) => {
    if(status === 'help')
    {
        return(
            <Stage>
                <LoadingText> Estamos esperando a que un asistente atienda su solicitud </LoadingText>
                <Loading />
            </Stage>
        )
    } else if (status === 'helping'){
        return(
            <Stage>
                <LoadingText> Un asistente viene en camino </LoadingText>
                <Loading />
            </Stage>
        )
    } else if (status === 'searching') {
        return(
            <Stage>
                <Loading />
            </Stage>
        )
    } else {
        return(null)
    }
}

export default LoadingComponent