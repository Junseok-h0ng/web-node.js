module.exports = {
    isOwner: function (req, userID) {

        const loginedUser = req.user.id;
        if (loginedUser == userID) {
            return true;
        } else {
            return false;
        }
    },
    status: function (req) {
        if (req.user) {
            const user = req.user;
            return `
                <a class="u-login u-login-1" href="/logout">Logout</a>
                <a class="u-login u-login-2" href="/user/${user.id}?page=1">${user.displayname}</a>`
        } else {
            return `
            <a class="u-login u-login-1" href="/user/login">Login</a>
            <a class="u-login u-login-2" href="/user/register">Register</a>`
        }
    }
}