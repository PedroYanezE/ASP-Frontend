import { useState } from 'react'
import { Outlet } from "react-router-dom";

import Header from "../shared/Header";
import Footer from '../shared/Footer';

const TeacherFrame = ({ socket }) => {
    const [activeClassroom, setActiveClassroom] = useState({})

    return(
        <>
            <Header />

            <Outlet context = {[activeClassroom, setActiveClassroom, socket]}/>

            <Footer />
        </>
    )
}

export default TeacherFrame