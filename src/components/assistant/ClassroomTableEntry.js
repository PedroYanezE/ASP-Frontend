import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import styled from 'styled-components';
import { MdExpandMore } from 'react-icons/md';

import classroomService from '../../services/classrooms';

const getTimeString = (date) => {
    if(date){
        const dateObject = new Date(date);
        const dateString = `${dateObject.getHours()}:${dateObject.getMinutes()}`;

        return dateString;
    } else {
        return null;
    };
};

const HelpButton = styled.button`
    background-color: transparent;
    border: 1px solid black;
    width: fit-content;
    cursor: pointer;

    &:hover {
        background-color: black;
        color: white;
    }
`;

const ExpandButton = styled.button`
    background-color: transparent;
    border: none;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
`;

const DetailsTrAssistant = styled.tr`
    display: ${props => props.opened === 'true' && props.status === 'Ayudando' ? 'default' : 'none'};
`;

const DetailsTrMessage = styled.tr`
    display: ${props => props.opened === 'true' && props.status !== 'ok' ? 'default' : 'none'};
`

const DetailsTrStatus = styled.tr`
    display: ${props => props.opened === 'true' ? 'default' : 'none'};
    border-bottom: 1px solid black;
`;


const ClassroomTableEntry = ({ currentClassroom, openModal }) => {
    const [classrooms, setClassrooms, user, setUser, socket] = useOutletContext();
    const [assistant, setAssistant] = useState("");

    const [detailsOpened, setDetailsOpened] = useState('false');

    const handleOpenDetails = () => {
        if (detailsOpened === 'true') { setDetailsOpened('false') } else { setDetailsOpened('true') };
    };

    // Handler para cuando el asistente presiona el botón de acción para una sala (botón puede ser ayudar o finalizar)
    const handleCallForHelp = async () => {
        // Se crean variables para modificar la sala y el estado que tendrá después de presionar el botón
        let newClassroom = {};
        let newStatus = ""

        // ¿Este caso sirve para algo? (nunca debería aparecer una sala con estado ok)
        if(currentClassroom.status === 'ok') {
            newClassroom = {
                status: 'help'
            };

            newStatus = "Ayuda"
        } 
        // Si la sala está pidiendo ayuda, cambiar el estado a ayudando e indicar que asistente está ayudando
        else if(currentClassroom.status === 'Ayuda') {
            newClassroom = {
                status: 'helping',
                assistant: user.id
            };

            setAssistant(user.name)
            newStatus = "Ayudando"

        }
        // Si ya se estaba ayudando a la sala, se finaliza al ayuda cambiando el estado a 'ok' (desaparece la sala)
        else if(currentClassroom.status === 'Ayudando') {
            newClassroom = {
                status: 'ok',
            };

            newStatus = "ok";
        };

        let updatedClassroom = null;

        try{
            updatedClassroom = await classroomService.updateOne(currentClassroom.id, newClassroom);

            if (newStatus === 'Ayudando')
            {
                socket.emit("helping", currentClassroom.id);
            } else if(newStatus === 'ok') {
                socket.emit("helped", currentClassroom.id);
            };

            let newClassrooms;

            newStatus !== 'ok'
            ? newClassrooms = classrooms.filter(classroom => currentClassroom.id !== classroom.id).concat({...updatedClassroom, status: newStatus})
            : newClassrooms = classrooms.filter(classroom => currentClassroom.id !== classroom.id);

            setClassrooms(newClassrooms);
        } catch(exception) {
            openModal();
        };
    };

    return(
        <tbody>
            <tr className='summary'>
                <td> { currentClassroom.name } </td>
                <td> { getTimeString(currentClassroom.updateTime) } </td>
                <td> { currentClassroom.status } </td>
                <td> <ExpandButton onClick = { handleOpenDetails }> <MdExpandMore/> </ExpandButton> </td>
            </tr>
            <DetailsTrAssistant className='details' opened = { detailsOpened } status = { currentClassroom.status }>
                <td colSpan = {4}> Atendido por { assistant ? assistant : currentClassroom.assistant?.name } </td>
            </DetailsTrAssistant>
            <DetailsTrMessage className='details' opened = { detailsOpened } status = { currentClassroom.status }>
                <td colSpan = {4}> <strong> Mensaje:</strong> { currentClassroom.status !== 'ok' ? currentClassroom.helpMessage : null } </td>
            </DetailsTrMessage>
            <DetailsTrStatus className='details' opened = { detailsOpened }>
                <td colSpan = {4}> <HelpButton onClick = { handleCallForHelp }> { currentClassroom.status === 'Ayuda' ? 'Ayudar' : 'Finalizar' } </HelpButton> </td>
            </DetailsTrStatus>
        </tbody>
    );
};

export default ClassroomTableEntry;