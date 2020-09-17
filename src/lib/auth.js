module.exports = {
    isOwner: function (req) {
        if (req.user) {
            return true;
        } else {
            return false;
        }
    }
}