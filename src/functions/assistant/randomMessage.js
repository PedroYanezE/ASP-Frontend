const messages = [
    'disfruta de un café☕',
    'aprovecha de estudiar📖',
    'relájate, te lo mereces🧘‍♀️🧘‍♂️',
    'lee tu libro favorito📕',
    'abraza a alguien🤗',
    'llama a un amigo📞',
    'escucha tu música favorita🎵',
    'disfruta de la vista🌅',
    'estírate, te hará bien🧘',
    'cahuinea con tus compañerxs🗣️'
]

const randomMessage = () => {
    return messages[Math.floor(Math.random()*messages.length)]
}

export default randomMessage