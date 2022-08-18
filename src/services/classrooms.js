import axios from 'axios'

const baseUrl = '/api/classrooms'

const getAll = () => {
    const classrooms = axios.get(baseUrl)

    return classrooms.then(response => response.data)
}

const getOne = (classroomId) => {
    const result = axios.get(`${baseUrl}/${classroomId}`)

    return result.then(response => response.data)
}

const findOne = (classroomName, classroomStatus) => {
    let result = null

    if(classroomName && classroomStatus)
    {
        result = axios.get(`${baseUrl}/?name=${classroomName.toUpperCase()}&status=${classroomStatus}`)
    } else if(classroomName)
    {
        result = axios.get(`${baseUrl}/?name=${classroomName.toUpperCase()}`)
    } else if(classroomStatus)
    {
        result = axios.get(`${baseUrl}/?status=${classroomStatus}`)
    } else {
        result = axios.get(`${baseUrl}/`)
    }

    return result.then(response => response.data)
}

const updateOne = (id, newObject) => {
    console.log(id, newObject)
    const request = axios.put(`${baseUrl}/${id}`, newObject)

    return request.then(response => response.data)
}

const exportedObject = {
    getAll,
    getOne,
    findOne,
    updateOne
}

export default exportedObject