import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import classroomService from '../../services/classrooms';
import ClassroomTableEntry from './ClassroomTableEntry';

import { IconContext } from 'react-icons/lib';
import { IoMdInformationCircle } from 'react-icons/io';

import Modal from 'react-modal';

import randomMessage from '../../functions/assistant/randomMessage';

const Container = styled.div`
    margin: 1rem;
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

const LogoutContainer = styled.div`
    position: absolute;
    bottom: 3rem;
    align-self: center;
`

const LogoutButton = styled.button`
    border: 0;
    background-color: transparent;
    text-decoration: underline;

    :hover {
        color: blue;
    };

    :click {
        color: red;
    };
`

const customStyles = {
    content: {
        display: 'flex',
        flexDirection: 'column',
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-25%',
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, .5)'
    }
};

Modal.setAppElement(document.getElementById('root'));

const Dashboard = () => {
    const [classroomsToHelp, setClassroomsToHelp, user, setUser, socket] = useOutletContext();
    const [message, setMessage] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleTimeout = () => {
        setModalIsOpen(false);

        handleLogout();
    };

    let navigate = useNavigate()

    // Al cargar la página por primera vez, obtener un mensaje de espera para cuando no hayan salas que requieran ayuda.
    useEffect(() => {
        setMessage(randomMessage());
    }, []);    

    // Obtener las salas y cambiar el status a español
    useEffect(() => {
        classroomService
            .findOne(null, 'help,helping')
            .then(result => result.map(classroom => {
                let newClassroom = classroom;

                if(newClassroom.status === 'help'){
                    newClassroom.status = 'Ayuda';
                } else {
                    newClassroom.status = 'Ayudando';
                };

                return newClassroom;
            }))
            .then(result => setClassroomsToHelp(result))
            .catch(error => console.log(error));
    }, [setClassroomsToHelp]);

    // Si el usuario está logeado, meterlo a la sala de asistentes de socketio
    useEffect(() => {
        if(user) socket.emit('join', 'assistants');
    }, [socket, user])
    
    //  Escuchar las emisiones de los profesores
    useEffect(() => {
        // Handler para cuando una sala necesita ayuda
        socket.on('HELP', (arg) => {
            const currentClassrooms = classroomsToHelp;
            const needyClassroom = arg;

            needyClassroom.status = "Ayuda";

            setClassroomsToHelp(currentClassrooms.concat(needyClassroom))
        });
    }, [socket, classroomsToHelp, setClassroomsToHelp]);

    // Handler para el logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("loggedUser");
        navigate("/asistente");
    };

    // Si hay salas que necesitan ayuda, mostrarlas, si no mostrar mensaje "relajante"
    if(classroomsToHelp.length !== 0)
    {
        return(
            <Container> 
                <Modal
                    isOpen = { modalIsOpen }
                    onRequestClose = { closeModal }
                    style = { customStyles }
                    shouldCloseOnOverlayClick = {false}
                    contentLabel = "Alerta de sesión expirada"
                >
                    <h2 style = {{ margin: '1rem 0 0 0' }}> SESIÓN TERMINADA </h2>

                    <p> Su sesión lleva abierta mucho tiempo, por favor ingrese nuevamente. </p>

                    <button
                        onClick = { handleTimeout }
                        style = {{
                            alignSelf: 'center',
                            margin: '.5rem 0 0 0',
                            border: '1px solid black',
                            padding: '.25rem 1rem'
                        }}
                    >
                        ENTENDIDO
                    </button>
                </Modal>

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
                            classroomsToHelp.sort((classroom_1, classroom_2) => {
                                if (classroom_1.updateTime < classroom_2.updateTime) return -1
                                else if (classroom_1.updateTime > classroom_2.updateTime) return 1
                                else return 0;
                            }).map(classroom =>
                                <ClassroomTableEntry key = { classroom.id } currentClassroom = { classroom } openModal = { openModal } />
                            )
                        }
                    </Table>
                </div>

                <LogoutContainer>
                    <LogoutButton onClick = { handleLogout }>
                        Cerrar Sesión 
                    </LogoutButton>
                </LogoutContainer>

            </Container>
        )
    } else {
        return(
            <>
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

                <LogoutContainer>
                    <LogoutButton onClick = { handleLogout }>
                        Cerrar Sesión 
                    </LogoutButton>
                </LogoutContainer>
            </>
        )
    };
};

export default Dashboard;