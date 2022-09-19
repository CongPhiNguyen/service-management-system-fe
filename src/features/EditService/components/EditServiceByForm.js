import { Button, Form, Input, InputNumber, Divider, Radio, Space, Checkbox, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import InputDependency from "./InputDependency"
import { post, get } from '../../../api/axios';
import { useParams } from "react-router-dom";
import URL from "../../../api/config"
/* eslint-disable */

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const validateMessages = {

    required: "${label} is required!",
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const options = [
    {
        label: 'Java',
        value: 'java',
    },
    {
        label: 'Mongodb',
        value: 'mongodb',
    },
    {
        label: 'Redis',
        value: 'redis',
    },
    {
        label: 'Hazelcast',
        value: 'hazelcast',
    },
    {
        label: 'Kafka',
        value: 'kafka',
    },
    {
        label: 'Elastic Search',
        value: 'elasticSearch',
    },
    {
        label: 'Nodejs',
        value: 'nodejs',
    },
];

export default function EditServiceByForm() {
    const params = useParams()
    const [service, setService] = useState(null)
    const [serviceDependencies, setServiceDependencies] = useState([])
    const [fields, setFields] = useState([])
    useEffect(() => {
        const getService = async () => {
            await get(URL.URL_GET_SERVICE + params.id)
                .then(res => {
                    if (res.data.service) {
                        setService(res.data.service)
                        setServiceDependencies(res.data.service.requirement.serviceDependencies.map(service => {
                            return service.serviceName
                        }))
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        getService()
    }, [])

    // form
    const onFinish = async (values) => {
        values.serviceDependencies = serviceDependencies
        console.log(values);
        await post(URL.URL_EDIT_SERVICE, { ...values })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    };

    // Radio
    const [scope, setScope] = useState();
    const onChange = (e) => {
        setScope(e.target.value);

    };

    // Checkbox
    const onChangeCheckBox = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    const test = [
        {
            test: 0,
            name: 0,
            isListField: true,
            fieldKey: 0
        },
        {
            test: 1,
            name: 1,
            isListField: true,
            fieldKey: 1
        },
        {
            test: 2,
            name: 2,
            isListField: true,
            fieldKey: 2
        }
    ]

    if (!service) return <div className='flex justify-center'>
        <Spin></Spin>
    </div>

    return (
        <Form {...layout} className="!pr-[100px]" name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
            {/* Name */}
            <Form.Item
                name={['serviceName']}
                label="Name Service"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={service.serviceName}
            >
                <Input />
            </Form.Item>
            {/* Author */}
            <Form.Item
                name={"author"}
                label="Author"
                rules={[
                    {
                        required: true
                    },
                ]}
                initialValue={service.author}
            >
                <Input disabled addonAfter="@taptap.com.vn" />
            </Form.Item>
            {/* Authoriza */}
            <Form.Item
                name={"authorizedPerson"}
                label="Authorized Person"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={service.authorizedPerson}
            >
                <Input addonAfter="@taptap.com.vn" />
            </Form.Item>
            {/* scope */}
            <Form.Item
                name={"isPublic"}
                label="Scope"
                rules={[
                    {
                        required: true
                    },
                ]}
                initialValue={service.isPublic ? "public" : "private"}
            >
                <Radio.Group onChange={onChange} value={scope}>
                    <Radio value={"public"}>Public</Radio>
                    <Radio value={"private"}>Private</Radio>
                </Radio.Group>
            </Form.Item>
            {/* Vesion */}
            <Form.Item
                name={['version']}
                label="Version"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={service.version}
            >
                <Input />
            </Form.Item>
            <Divider></Divider>
            {/* url public */}
            <Form.Item
                name={['endpointPublicUrl']}
                label="Endpoint Public URL"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={service.monitoring.endpointPublicUrl}
            >
                <Input addonBefore="http://" />
            </Form.Item>
            {/* url private */}
            <Form.Item
                name={['endpointPrivateUrl']}
                label="Endpoint Private URL"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={service.monitoring.endpointPrivateUrl}
            >
                <Input addonBefore="http://" />
            </Form.Item>
            <Divider></Divider>
            {/* Alert to */}
            <Form.Item
                label="Alert To"
            >
                <Form.List name={"alertTo"}>
                    {(fields, { add, remove }) => (
                        <>
                            {console.log(fields)}
                            {console.log(test)}
                            {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} align="baseline">
                                    <Form.Item
                                        {...restField}
                                        label="Name"
                                        name={[name, 'name']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing price',
                                            },
                                        ]}
                                        initialValue={"phước"}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        label="Email"
                                        name={[name, 'email']}
                                        rules={[
                                            {
                                                type: "email",
                                                required: true
                                            },
                                        ]}
                                        initialValue={"phuoc.t.luong@gmail.com"}
                                    >
                                        <Input addonAfter="@taptap.com.vn" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        label="Phone"
                                        name={[name, 'phone']}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                        initialValue={"0387527010"}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}

                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Person
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>

            {/* Alert bot */}
            <Form.Item
                label="Alert Bot"
            >
                <Space align="end">
                    <Form.Item
                        label="Bot Name"
                        name={['nameBot']}
                        rules={[
                            {
                                required: true,
                                message: 'Bot Name is require',
                            },
                        ]}
                        initialValue={service.monitoring.alertBot.name}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Bot Endpoint"
                        name={['botEndpoint']}
                        rules={[
                            {
                                required: true,
                                message: 'Bot Endpoint is require',
                            },
                        ]}
                        initialValue={service.monitoring.alertBot.botEndpoint}
                    >
                        <Input addonBefore="http://" />
                    </Form.Item>
                </Space>
            </Form.Item>
            <Divider></Divider>
            <Form.Item
                name={['domain']}
                label="Domain"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={service.requirement.domain}
            >
                <Input addonBefore="http://" addonAfter=".taptap.com.vn" />
            </Form.Item>
            <Form.Item
                name={['port']}
                label="Port"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                        max: 99999,
                    },
                ]}
                initialValue={service.requirement.port}
            >
                <InputNumber />
            </Form.Item>
            <Form.Item
                name={['platform']}
                label="Platform"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={service.requirement.platform}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name={['serviceDependencies']}
                label="Service Dependencies"
            >
                <InputDependency serviceDependencies={serviceDependencies} setServiceDependencies={setServiceDependencies}></InputDependency>
            </Form.Item>
            <Divider></Divider>
            <Form.Item
                name={['infrastructure']}
                label="Infrastructure"
                initialValue={Object.keys(service.requirement.infrastructure).filter(value => {
                    if (service.requirement.infrastructure[value] === true) {
                        return value
                    }
                })}
            >
                <Checkbox.Group options={options} onChange={onChangeCheckBox} />
            </Form.Item>
            <Form.Item
                name={"database"}
                label="Database name"
                rules={[
                    {
                        required: true
                    },
                ]}
                initialValue={service.requirement.database.mongodb.dbName}
            >
                <Input addonBefore="mongodb" />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
        </Form >
    )
}
