import React, { useState } from "react";
import { message } from "antd";
import { Button, Typography } from "@mui/material";
import { post } from "../../../api/axios"
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from "react-redux";
import { Input } from 'antd';
import URL from "../../../api/config"
import "./authentication.scss"
import { UserLogin } from "../../../actions/userAction"
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = () => {
        if (username.length === 0 || password.length === 0) {
            message.error("Nhập đầy đủ thông tin")
        } else {
            post(URL.URL_ADMIN_LOGIN, { username, password })
                .then(res => {
                    if (res.data.message === "Đăng nhập thành công") {
                        message.success(res.data.message)
                        dispatch(UserLogin(res.data.token))
                        navigate("/service-management   ")
                    } else {
                        message.error(res.data.message)
                    }
                })
                .catch(err => {
                    message.error(err.message)
                })
        }
    }
    return (
        <div className="body">
            <img style={{ position: "fixed", top: "100px", left: "20px" }} src="./login.png" alt="IMAGE " />
            <form className="form">
                <Typography mb={2} variant="h2" component="h2">
                    Login
                </Typography>
                <Input
                    size="large"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    placeholder="Username"
                    prefix={<UserOutlined />}
                    className={"mb-8"}
                />
                <Input
                    size="large"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="Password"
                    prefix={<LockOutlined />}
                    className={"mb-8"}
                    type={"password"}
                />
                <Button
                    onClick={handleLogin}
                    sx={{ width: "100%" }}
                    variant="contained"
                    size="large"
                >
                    Login
                </Button>
            </form>
        </div>
    )
}
