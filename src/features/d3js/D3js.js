import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { get } from "../../api/axios"
import URL from "../../api/config"
import RemoveAccents from '../../helper/RemoveAccents';
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

// const options = [
//     {
//         label: renderTitle('Libraries'),
//         options: [renderItem('AntDesign'), renderItem('AntDesign UI')],
//     },
//     {
//         label: renderTitle('Solutions'),
//         options: [renderItem('AntDesign UI FAQ'), renderItem('AntDesign FAQ')],
//     },
//     {
//         label: renderTitle('Articles'),
//         options: [renderItem('AntDesign design language')],
//     },
// ];

const App = () => {
    const [allUser, setAllUser] = useState([])
    const [options, setOptions] = useState([])

    useEffect(() => {
        get(URL.URL_GET_ALL_EMAIL)
            .then(res => {
                setAllUser = setAllUser(res.data.users)
            }).catch(err => {
                console.log(err);
            })
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
            console.log(results)
            setOptions(results)
        }
    }

    return (
        <AutoComplete
            popupClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={500}
            style={{
                width: 250,
            }}
            options={options}
        >
            <Input size="small" onChange={handleChange} placeholder="input here" />
        </AutoComplete>
    )

}




export default App;
