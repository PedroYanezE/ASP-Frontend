import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";

import Header from "../shared/Header";
import Footer from '../shared/Footer';

import styled from 'styled-components';

import classroomService from '../../services/classrooms';
import loginService from '../../services/login';

const Main = styled.main`
    display: flex;
    flex-direction: column;

    width: 100vw;
`;

const Error = styled.p`
    margin: 0;
    display: ${props => props.error ? "block" : "none"};
    color: red;
`;

const FormFrame = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background-color: #F2F2F2;
    margin: 1rem;
    padding: 1rem 3rem;
    gap: 1rem;
`

const InputBox = styled.div`
    font-size: 1.125rem;

    & input {
        height: 2rem;
        width: 100%;
        border: 1px solid black;
        font-size: 1rem;
        margin-top: 0.5rem;
    };
`

const LoginButton = styled.button`
    border: 1px solid black;
    font-size: 1rem;
    padding: .25rem 1.5rem;
`

const AssistantFrame = ({ socket }) => {
    const [classroomsToHelp, setClassroomsToHelp] = useState([]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser');

        if(loggedUserJSON){
            const loggedUser = JSON.parse(loggedUserJSON);
            setUser(loggedUser);
            classroomService.setToken(loggedUser.token);
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const loggedUser = await loginService.login({
                username, password
            });

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(loggedUser)    
            );

            classroomService.setToken(loggedUser.token);

            socket.emit('join', 'assistants');

            setUser(loggedUser);
            setUsername('');
            setPassword('');
        } catch(exception) {
            setErrorMessage('Wrong credentials');
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        };
    };

    const loginForm = () => (
        <FormFrame onSubmit = {handleLogin}>
            <InputBox>
                <label htmlFor='username'> Nombre de usuario </label>

                <input
                    type = 'text'
                    placeholder=' '
                    value = {username}
                    name = 'Username'
                    id = 'username'
                    onChange = {(event) => setUsername(event.target.value)}
                />
            </InputBox>
            <InputBox>
                <label htmlFor='password'> Contraseña </label>

                <input
                    type = 'password'
                    value = {password}
                    name = 'Password'
                    id = 'password'
                    onChange = {(event) => setPassword(event.target.value)}
                />
            </InputBox>

            <Error error = { errorMessage }> { errorMessage } </Error>

            <div>
                <LoginButton type = 'submit'> login </LoginButton>
            </div>
        </FormFrame>
    )

    return(
        <>
            <Header />

            <Main>
                { user === null 
                    ? loginForm()
                    : <Outlet context = {[classroomsToHelp, setClassroomsToHelp, user, setUser, socket]} />
                }
            </Main>

            <Footer />
        </>
    );
};

export default AssistantFrame;