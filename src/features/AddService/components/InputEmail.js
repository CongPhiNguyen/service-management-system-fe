import { AutoComplete, Input, Form, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { get } from "../../../api/axios"
import URL from "../../../api/config"
const renderTitle = (title) => (
    <span>
        {title}

    </span>
);

const renderItem = (title) => ({
    value: title,
    label: (
        <div
            style={{
                display: 'flex',
                justifyContent: 'start',
            }}
        >
            {title}
        </div>
    ),
});

const EmailInput = (props) => {
    const [allUser, setAllUser] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        const getApi = () => {
            get(URL.URL_GET_ALL_EMAIL)
                .then(res => {
                    setAllUser(res.data.users)
                }).catch(err => {
                    message.error(err.message)
                })
        }
        getApi()
    }, [])

    const handleChange = (e) => {
        const results = []
        if (e.target.value.length === 0) {
            setOptions([])
        } else {
            allUser.forEach(user => {
                if ((user.email.includes(e.target.value))) {
                    if (results.length < 3) {
                        results.push({
                            label: renderTitle(user.name),
                            options: [renderItem(user.email)],
                        });
                    } else {
                        return
                    }
                }
            })
            setOptions(results)
        }
    }

    return (
        <Form.Item
            name={[props.name]}
            label={props.label}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <AutoComplete
                popupClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={500}
                options={options}
            >

                <Input onChange={handleChange} placeholder="abc.d.e" addonAfter="@taptap.com.vn" />
            </AutoComplete>
        </Form.Item>
    )

}




export default EmailInput;
