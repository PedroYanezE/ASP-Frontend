import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import styled from 'styled-components';
import classroomService from '../../services/classrooms';
import ClassroomTableEntry from './ClassroomTableEntry';

import { IconContext } from 'react-icons/lib';
import { IoMdInformationCircle } from 'react-icons/io'

import randomMessage from '../../functions/assistant/randomMessage';

const Container = styled.div`
    margin: 1rem;
    width: 100%;
    border: 1px solid black;
    background-color: transparent;

    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-content: center;
`;

const CardContainer = styled.div`
    margin: 1rem;
    padding: 1rem 3rem;
    width: 100%;
    background-color: #F2F2F2;
    position: relative;
    font-weight: lighter;
`

const CardInformation = styled.div`
    position: absolute;
    top: 1.270rem;
    left: 1rem;

    width: 1rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
`

const CardText = styled.p`
    margin: 0;
    padding: 0;
`

const Table = styled.table`
    border-collapse: collapse;
    border: 1px solid black;
    width: 100%;
    font-size: 0.9rem;
    overflow: hidden;

    
    thead tr {
        text-align: left;
        font-weight: bold;
        background-color: black;
        color: white;
    }

    & tbody:nth-of-type(even){
        background-color: #F3F3F3;
    }
    
    td, th {
        padding: .75rem .9rem;
    }
`;

const Dashboard = () => {
    const [classroomsToHelp, setClassroomsToHelp] = useOutletContext();
    const [message, setMessage] = useState("")

    useEffect(() => {
        classroomService
            .findOne(null, 'help,helping')
            .then(result => result.map(classroom => {
                let newClassroom = classroom;

                if(newClassroom.status === 'help'){
                    newClassroom.status = 'Ayuda';
                } else {
                    newClassroom.status = 'Ayudando';
                }

                return newClassroom;
            }))
            .then(result => setClassroomsToHelp(result))
            .catch(error => console.log(error))
    }, [setClassroomsToHelp])

    useEffect(() => {
      setMessage(randomMessage())
    }, [])

    if(classroomsToHelp.length !== 0)
    {
        return(
            <Container>
                <div style = {{ textAlign: 'center' }}>
                    <h2> TODAS </h2>
                </div>
    
                <div style = {{ margin: '0 1rem 2rem 1rem' }}>
                    <Table>
                        <thead>
                            <tr>
                                <th> Sala </th>
                                <th> Hora </th>
                                <th> Estado </th>
                                <th></th>
                            </tr>
                        </thead>
                        {
                            classroomsToHelp.map(classroom =>
                                <ClassroomTableEntry key = { classroom.id } currentClassroom = { classroom } />
                            )
                        }
                    </Table>
                </div>
    
            </Container>
        )
    } else {
        return(
            <CardContainer>
                <CardInformation>
                    <IconContext.Provider value = {{ className: 'information-icon', size: 16 }}>
                        <>
                            <IoMdInformationCircle/>
                        </>
                    </IconContext.Provider>
                </CardInformation>
                <CardText> ¡Ninguna sala requiere asistencia! </CardText>
                <CardText> Por mientras... { message } </CardText>
            </CardContainer>
        )
    }
};

export default Dashboard;