import { useState } from 'react';
import { Outlet } from "react-router-dom";

import Header from "../shared/Header";
import Footer from '../shared/Footer';

import styled from 'styled-components';

const Main = styled.main`
    display: flex;
`

const AssistantFrame = () => {
    const [classroomsToHelp, setClassroomsToHelp] = useState([]);

    return(
        <>
            <Header />

            <Main>
                <Outlet context = {[classroomsToHelp, setClassroomsToHelp]}/>
            </Main>

            <Footer />
        </>
    );
};

export default AssistantFrame;