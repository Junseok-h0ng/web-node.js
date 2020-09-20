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
            return `<a class="u-login u-login-1" href="/logout">Logout</a>`
        } else {
            return `<a class="u-login u-login-1" href="/user/login">Login</a>`
        }
    }
}