const { db } = require('../modules/database');

const sendFriendRequest = async (from, to) => {
    try {
        await db.query("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)", [from, to])
    } catch (err){
       throw err 
    }
}

module.exports = { sendFriendRequest }