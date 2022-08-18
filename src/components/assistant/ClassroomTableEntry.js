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

const DetailsTrStatus = styled.tr`
    display: ${props => props.opened === 'true' ? 'default' : 'none'};
    border-bottom: 1px solid black;
`;

const ClassroomTableEntry = ({ currentClassroom }) => {
    const [classrooms, setClassrooms] = useOutletContext();

    const [detailsOpened, setDetailsOpened] = useState('false');

    const handleOpenDetails = () => {
        if (detailsOpened === 'true') { setDetailsOpened('false') } else { setDetailsOpened('true') };
    };

    const handleCallForHelp = async () => {
        let newClassroom = {};
        let newStatus = ""

        if(currentClassroom.status === 'ok') {
            newClassroom = {
                status: 'help'
            };

            newStatus = "Ayuda"
        } else if(currentClassroom.status === 'Ayuda') {
            newClassroom = {
                status: 'helping',
                assistant: '62eb508b1a6b58d5c15fa4ed'
            };

            newStatus = "Ayudando"
        } else if(currentClassroom.status === 'Ayudando') {
            newClassroom = {
                status: 'ok',
            };

            newStatus = "ok"
        };

        const updatedClassroom = await classroomService.updateOne(currentClassroom.id, newClassroom);

        let newClassrooms;

        newStatus !== 'ok'
        ? newClassrooms = classrooms.filter(classroom => currentClassroom.id !== classroom.id).concat({...updatedClassroom, status: newStatus})
        : newClassrooms = classrooms.filter(classroom => currentClassroom.id !== classroom.id);

        setClassrooms(newClassrooms)
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
                <td colSpan = {4}> Atendido por { currentClassroom.assistant?.name } </td>
            </DetailsTrAssistant>
            <DetailsTrStatus className='details' opened = { detailsOpened }>
                <td colSpan = {4}> <HelpButton onClick = { handleCallForHelp }> { currentClassroom.status === 'Ayuda' ? 'Ayudar' : 'Finalizar' } </HelpButton> </td>
            </DetailsTrStatus>
        </tbody>
    );
};

export default ClassroomTableEntry;