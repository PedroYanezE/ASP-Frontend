import React, { useEffect, useState } from "react"
import classroomService from "../../services/classrooms";

import { useLocation, useOutletContext } from "react-router-dom";

import Separator from "../shared/Separator";
import Loading from "../shared/Loading";

import styled from 'styled-components';

const Container = styled.div`
    background-color: #f4f4f4;
    margin: 1rem 1.75rem;
    padding: 1rem 2rem;
`;

const ContainerTitle = styled.h2`
    margin: 0;
    font-size: 1.25rem;
    text-align: center;
`;

const ContainerForm = styled.form`
    display: flex;
    flex-direction: column;
    position: relative;
`;

const FormTextArea = styled.textarea`
    width: 100%;
    height: 4rem;
    margin-bottom: 1rem;
    resize: none;
    box-sizing: border-box;
`

const FormButton = styled.button`
    padding: 0 1rem;
    margin-bottom: 1rem;
    width: fit-content;
    height: 1.75rem;
    cursor: ${props => props.helping === 'ok' ? 'pointer' : 'default'};
    
    border: ${props => props.helping === 'ok' ? '1px solid black' : 0};
    background-color: ${props => props.helping === 'ok' ? 'transparent' : 'rgb(153, 153, 153)'};
    color: ${props => props.helping === 'ok' ? 'black' : 'white'};
    font-size: 1.125rem;
    font-weight: lighter;
    align-self: center;
`;

const Error = styled.p`
    display: ${props => props.error ? "block" : "none"};
    color: red;
`;

const WaitingRoom = () => {
    const [activeClassroom, setActiveClassroom] = useOutletContext()

    const [help, setHelp] = useState('ok');
    const [helpMessage, setHelpMessage] = useState('');
    const [error, setError] = useState('');
    const loc = useLocation();

    useEffect(() => {
        if(JSON.stringify(activeClassroom) === JSON.stringify({}))
        {
            classroomService
                .getOne(loc.pathname)
                .then(returnedClassroom => {
                    setHelp(returnedClassroom.status)
                    setActiveClassroom(returnedClassroom)
                })
                .catch(() => setError('Tenemos problemas ubicando su sala, intente más tarde'))
        } else {
            setHelp(activeClassroom.status)
        }
    }, [activeClassroom, setActiveClassroom, loc])

    const handleCallForHelp = (event) => {
        event.preventDefault();

        setError('')

        switch(help){
            case 'ok':
                setHelp('help');

                const newClassroom = activeClassroom
                newClassroom.status = 'help'

                classroomService
                    .updateOne(newClassroom.id, newClassroom)
                    .then(() => setActiveClassroom(newClassroom))
                    .catch(error => setError('Tenemos comunicándonos con los asistentes, intente más tarde'))
                break;
            default:
                setHelp(help);
        };
    };

    return(
        <Container>
            <ContainerTitle> ¡Bienvenido al sistema de ayuda de SEAD! </ContainerTitle>

            {
                JSON.stringify(activeClassroom) !== JSON.stringify({})
                ? <p> Usted se encuentra en la sala { activeClassroom.name } </p>
                : <>
                    <p> Estamos buscando la sala en la que se encuentra, espere un momento </p>
                    {
                        !error
                        ? <Loading status = 'searching'/>
                        : null
                    }
                  </>
            }

            <Separator/>

            {
                !error && JSON.stringify(activeClassroom) !== JSON.stringify({})
                ?
                    <ContainerForm
                        onSubmit = { handleCallForHelp }
                    >
                        <p style = {{ textAlign: 'center', fontSize: '.9rem', margin: '0', marginBottom: '1rem' }}> Cuéntenos por qué necesita asistencia: </p>
            
                        <FormTextArea
                            value = { helpMessage }
                            onChange = { (event) => setHelpMessage(event.target.value) }
                        ></FormTextArea>
                        <FormButton 
                            helping = { help }
                            type = "submit"
                        >
                            Solicitar asistencia
                        </FormButton>
                    </ContainerForm>
                : null
            }

            <Error error = { error }> 
                { error }
            </Error>

            {
                !error
                ? <Loading status = { help }/>
                : null
            }

        </Container>
    );
};

export default WaitingRoom;