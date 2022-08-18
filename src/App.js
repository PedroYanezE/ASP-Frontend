import React from 'react';

import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'

import TeacherFrame from './components/teacher/TeacherFrame';
import AssistantFrame from './components/assistant/AssistantFrame';

import ClassroomSelector from './components/teacher/ClassroomSelector';
import WaitingRoom from './components/teacher/WaitingRoom';

import Dashboard from './components/assistant/Dashboard'

const App = () => {
    return (
        <BrowserRouter> 
            <Routes>
                <Route path = "/asistente" element = { <AssistantFrame /> }>
                    <Route index element = { <Dashboard /> } />
                </Route>
                <Route path = "/" element = { <TeacherFrame /> }>
                    <Route index element = { <ClassroomSelector /> } />
                    <Route path = ":classroomName" element = { <WaitingRoom /> } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;