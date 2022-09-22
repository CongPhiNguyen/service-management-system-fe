import { AutoComplete, Input, Form } from 'antd';
import React, { useState } from 'react';

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
    const [options, setOptions] = useState([])
    const handleChange = (e) => {
        if (e.target.value.length === 0) {
            setOptions([])
        } else {
            const results = []
            props.allUser.forEach(user => {
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

    console.log(props.index);
    return (
        <Form.Item
            name={props.index ? [props.index, props.name] : [props.name]}
            label={props.label}
            {...props.restField}
            rules={
                [
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
        </Form.Item >
    )

}




export default EmailInput;
