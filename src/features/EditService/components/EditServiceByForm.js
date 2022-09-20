import { Button, Form, Input, InputNumber, Divider, Radio, Space, Checkbox, Spin, message, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import InputDependency from "./InputDependency"
import { post, get } from '../../../api/axios';
import { useNavigate, useParams } from "react-router-dom";
import URL from "../../../api/config"
import EmailInput from './InputEmail';
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
    const navigate = useNavigate()
    const [service, setService] = useState(null)
    const [serviceDependencies, setServiceDependencies] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState()
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
                    message.error(err.message)
                })
        }
        getService()
    }, [])


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        await post(URL.URL_EDIT_SERVICE + params.id, { ...data })
            .then(res => {
                if (res.data.status === 0) {
                    if (res.data.deadlock) {
                        res.data.deadlock.forEach(deadlock => {
                            if (deadlock.deadlock === true) {
                                message.error(`Việc thêm service ${deadlock.serviceName} vào dependencies xảy ra deadlock`)
                            }
                        })
                    } else {
                        message.error(res.data.message)
                    }
                } else {
                    message.success(`Service ${service.serviceName} chỉnh sửa thành công!`)
                    navigate("/service-management")
                }
            })
            .catch(err => {
                message.error(err.message)
            })
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // form
    const onFinish = async (values) => {
        values.serviceDependencies = serviceDependencies
        setData(values)
        showModal()

    };

    // Radio
    const [scope, setScope] = useState();
    const onChange = (e) => {
        setScope(e.target.value);

    };

    // Checkbox
    const onChangeCheckBox = (checkedValues) => {
        // console.log('checked = ', checkedValues);
    };


    if (!service) return <div className='flex justify-center'>
        <Spin></Spin>
    </div>

    return (
        <>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Bạn có chắc chắn muốn thêm service?</p>
            </Modal>
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
                <EmailInput name="author" label="Author" initValue={service.author}></EmailInput>

                {/* Authoriza */}
                <EmailInput name="authorizedPerson" label="Authorized Person" initValue={service.authorizedPerson}></EmailInput>

                {/* <Form.Item
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
                </Form.Item> */}
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
                    <InputDependency service={service} serviceDependencies={serviceDependencies} setServiceDependencies={setServiceDependencies}></InputDependency>
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
        </>
    )
}
