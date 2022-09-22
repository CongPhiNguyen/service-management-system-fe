import { setAccessToken } from "../helper/Cookies"
export const UserLogin = (token) => dispatch => {
    setAccessToken(token)
    dispatch({
        type: "USER_LOGIN",
    })
}

export const UserLogout = () => dispatch => {
    dispatch({
        type: "USER_LOGOUT",
    })
}

