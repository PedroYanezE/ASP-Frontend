import React, { useState } from 'react';
import classroomService from "../../services/classrooms";

import styled from 'styled-components';

import { useNavigate, useOutletContext } from 'react-router-dom';

import Separator from '../shared/Separator';
import Loading from '../shared/Loading';

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

const ContainerBody = styled.p`
    text-align: center;
`;

const ContainerForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const FormInput = styled.input`
    margin-bottom: 1rem;
`;

const FormButton = styled.button`
    width: fit-content;
    align-self: center;
    margin-bottom: 1rem;
`;

const Error = styled.p`
    margin: 0;
    display: ${props => props.error ? "block" : "none"};
    color: red;
`;

const ClassroomSelector = () => {
    const [activeClassroom, setActiveClassroom] = useOutletContext();

    const [classroomName, setClassroomName] = useState("");
    const [error, setError] = useState('');
    const [searching, setSearching] = useState('');

    const navigate = useNavigate();

    const handleClassroomChange = (event) => {
        event.preventDefault();

        const name = event.target[0].value;
        const re = /^[A-Za-z]{1,2}\d+$/;

        if(re.exec(name))
        {
            setSearching('searching');

            classroomService
                .findOne(name)
                .then(result =>
                    {
                        setActiveClassroom(result[0]);
                        setSearching('');
                        navigate(`/${result[0].id}`);
                    }
                )
                .catch(() => {
                        setSearching('');
                        setError('No se encontró una sala con este nombre, por favor revise que esté correctamente escrita');
                    }
                );
        } else {
            setError('Por favor ingrese un nombre de sala válido');
        }
    };

    return(
        <Container>
            <ContainerTitle> ¡Bienvenido al sistema de ayuda de SEAD! </ContainerTitle>

            <Separator/>

            <ContainerBody> Para acceder, indique la sala en la que se encuentra (por ejemplo: M301, PC04) </ContainerBody>

            <ContainerForm onSubmit = { handleClassroomChange }>
                <FormInput
                    type = "text"
                    name = "classroomName"
                    value = { classroomName }
                    onChange = { (event) => setClassroomName(event.target.value) }
                />


                <FormButton>
                    Acceder
                </FormButton>
            </ContainerForm>

            <Loading status = { searching } />

            {
                !searching
                ?
                    <Error error = { error }>
                        { error }
                    </Error>
                : null
            }
        </Container>
    );
};

export default ClassroomSelector;