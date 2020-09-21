module.exports = {
    isOwner: function (req) {
        if (req.user) {
            return true;
        } else {
            return false;
        }
    },
    status: function (req) {
        if (req.user) {
            const displayname = req.user.displayname;
            return `
                <a class="u-login u-login-1" href="/logout">Logout</a>
                <a class="u-login u-login-2" href="/user/${displayname}">${displayname}</a>`
        } else {
            return `
            <a class="u-login u-login-1" href="/user/login">Login</a>
            <a class="u-login u-login-2" href="/user/register">Register</a>`
        }
    }
}