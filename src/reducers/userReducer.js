const initialState = {
    isLogin: false,
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return {
                isLogin: true,
            }
        case "USER_LOGOUT":
            return {
                isLogin: false,
            }
        default:
            return state
    }
}

export default userReducer