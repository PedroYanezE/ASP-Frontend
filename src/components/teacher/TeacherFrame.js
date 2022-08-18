import { useState } from 'react'
import { Outlet } from "react-router-dom";

import Header from "../shared/Header";
import Footer from '../shared/Footer';

const TeacherFrame = () => {
    const [activeClassroom, setActiveClassroom] = useState({})

    return(
        <>
            <Header />

            <Outlet context = {[activeClassroom, setActiveClassroom]}/>

            <Footer />
        </>
    )
}

export default TeacherFrame