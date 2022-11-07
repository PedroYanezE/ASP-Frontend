import React, { useState, useEffect } from 'react';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import io from 'socket.io-client';

import TeacherFrame from './components/teacher/TeacherFrame';
import AssistantFrame from './components/assistant/AssistantFrame';

import ClassroomSelector from './components/teacher/ClassroomSelector';
import WaitingRoom from './components/teacher/WaitingRoom';

import Dashboard from './components/assistant/Dashboard'

const socket = io();

const App = () => {
    useEffect(() => {
        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path = "/asistente" element = { <AssistantFrame socket = { socket } /> }>
                    <Route index element = { <Dashboard /> } />
                </Route>
                <Route path = "/" element = { <TeacherFrame socket = { socket } /> }>
                    <Route index element = { <ClassroomSelector /> } />
                    <Route path = ":classroomName" element = { <WaitingRoom /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;