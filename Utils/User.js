class User {
    constructor() {
        this.users = []
    }

    addUser({ id, username, room}){

        //Clean The Data
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

        //Validate The data
        if (!username || !room) {
            return {
                error : "Username & Room Are Required"
            }
        }

        //Check for Existing User
        const existingUser = this.users.find((user) => {
            return user.room === room && user.username === username 
        })

        //Validate Username
        if(existingUser) {
            return {
                error : "Username Already In Use"
            }
        }

        

        //Store User
        const user = {
            id,
            username,
            room
        }

        this.users.push(user)
        return { user }
    }

    getUsersInRoom (room) {
        room = room.trim().toLowerCase()
        return this.users.filter(user => user.room === room)
    }
}

module.exports = User