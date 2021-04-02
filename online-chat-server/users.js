const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name );

    // when existing, kick back and not adding new user
    if(existingUser){
        return { error: 'Username is taken.'}
    }

    // otherwise, add the user
    const user = { id, name, room };

    users.push(user);

    // return the user so that we know which user was pushed. 
    return { user }
}

const removeUser = (id) => {
    // find if the id exists in users array
    const index = users.findIndex((user) => user.id ===id );

    // found one
    if(index !== -1) {
        // remove the user from users array
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);

// use the filter function
const getUsersInRoom = (room) => users.filter((user) => user.room === room );

module.exports = { addUser, removeUser, getUser, getUsersInRoom };