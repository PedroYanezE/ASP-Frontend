import axios from 'axios';
const baseUrl = '/api/classrooms';

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`;
};

const getAll = () => {
    const classrooms = axios.get(baseUrl);

    return classrooms.then(response => response.data);
};

const getOne = (classroomId) => {
    const result = axios.get(`${baseUrl}/${classroomId}`);

    return result.then(response => response.data);
};

const findOne = (classroomName, classroomStatus) => {
    let result = null;

    if(classroomName && classroomStatus)
    {
        result = axios.get(`${baseUrl}/?name=${classroomName.toUpperCase()}&status=${classroomStatus}`);
    } else if(classroomName)
    {
        result = axios.get(`${baseUrl}/?name=${classroomName.toUpperCase()}`);
    } else if(classroomStatus)
    {
        result = axios.get(`${baseUrl}/?status=${classroomStatus}`);
    } else {
        result = axios.get(`${baseUrl}/`);
    };

    return result.then(response => response.data);
};

const updateOne = async (id, newObject) => {
    const config = { 
        headers: {
            Authorization: token,
        },
    };

    const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
    return response.data;
};

const exportedObject = {
    getAll,
    getOne,
    findOne,
    updateOne,
    setToken
}

export default exportedObject