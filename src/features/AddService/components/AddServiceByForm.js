import {
  Button,
  Form,
  Input,
  InputNumber,
  Divider,
  Radio,
  Space,
  Checkbox,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import InputDependency from "./InputDependency";
import { post } from "../../../api/axios";
import URL from "../../../api/config";
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
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const options = [
  {
    label: "Java",
    value: "java",
  },
  {
    label: "Mongodb",
    value: "mongodb",
  },
  {
    label: "Redis",
    value: "redis",
  },
  {
    label: "Hazelcast",
    value: "hazelcast",
  },
  {
    label: "Kafka",
    value: "kafka",
  },
  {
    label: "Elastic Search",
    value: "elasticSearch",
  },
  {
    label: "Nodejs",
    value: "nodejs",
  },
];
export default function AddServiceByForm() {
  useEffect(() => {
    const getAllService = async () => {
      get(URL.URL_GET_ALL_SERVICE)
        .then((res) => {
          console.log(res);
          res.data.services.map((name) => {
            return {
              value: name.serviceName,
            };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllService();
  }, []);

  const [serviceDependencies, setServiceDependencies] = useState([]);

  // form
  const onFinish = async (values) => {
    values.serviceDependencies = serviceDependencies;
    console.log(values);
    await post(URL.URL_ADD_NEW_SERVICE, { ...values })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Radio
  const [scope, setScope] = useState();
  const onChange = (e) => {
    setScope(e.target.value);
  };

  // Checkbox
  const onChangeCheckBox = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  return (
    <Form
      {...layout}
      className="!pr-[100px]"
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      {/* Name */}
      <Form.Item
        name={["serviceName"]}
        label="Name Service"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"Service-LTP"}
      >
        <Input />
      </Form.Item>
      {/* Author */}
      <Form.Item
        name={"author"}
        label="Author"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"phuoc.t.luong"}
      >
        <Input addonAfter="@taptap.com.vn" />
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
        initialValue={"phuoc.t.luong"}
      >
        <Input addonAfter="@taptap.com.vn" />
      </Form.Item>
      {/* scope */}
      <Form.Item
        name={"isPublic"}
        label="Scope"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"public"}
      >
        <Radio.Group onChange={onChange} value={scope}>
          <Radio value={"public"}>Public</Radio>
          <Radio value={"private"}>Private</Radio>
        </Radio.Group>
      </Form.Item>
      {/* Vesion */}
      <Form.Item
        name={["version"]}
        label="Version"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"14/09/2022 build 5"}
      >
        <Input />
      </Form.Item>
      <Divider></Divider>
      {/* url public */}
      <Form.Item
        name={["endpointPublicUrl"]}
        label="Endpoint Public URL"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"abc-public.taptap.com.vn"}
      >
        <Input addonBefore="http://" />
      </Form.Item>
      {/* url private */}
      <Form.Item
        name={["endpointPrivateUrl"]}
        label="Endpoint Private URL"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"abc-public.taptap.com.vn"}
      >
        <Input addonBefore="http://" />
      </Form.Item>
      <Divider></Divider>
      {/* Alert to */}
      <Form.Item label="Alert To">
        <Form.List name={"alertTo"}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item
                    {...restField}
                    label="Name"
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing price",
                      },
                    ]}
                    initialValue={"phước"}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Email"
                    name={[name, "email"]}
                    rules={[
                      {
                        type: "email",
                        required: true,
                      },
                    ]}
                    initialValue={"phuoc.t.luong@gmail.com"}
                  >
                    <Input addonAfter="@taptap.com.vn" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Phone"
                    name={[name, "phone"]}
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
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Person
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      {/* Alert bot */}
      <Form.Item label="Alert Bot">
        <Space align="end">
          <Form.Item
            label="Bot Name"
            name={["nameBot"]}
            rules={[
              {
                required: true,
                message: "Bot Name is require",
              },
            ]}
            initialValue={"youtube"}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Bot Endpoint"
            name={["botEndpoint"]}
            rules={[
              {
                required: true,
                message: "Bot Endpoint is require",
              },
            ]}
            initialValue={"telegram.com.vn"}
          >
            <Input addonBefore="http://" />
          </Form.Item>
        </Space>
      </Form.Item>
      <Divider></Divider>
      <Form.Item
        name={["domain"]}
        label="Domain"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue="phuoc.t.luong"
      >
        <Input addonBefore="http://" addonAfter=".taptap.com.vn" />
      </Form.Item>
      <Form.Item
        name={["port"]}
        label="Port"
        rules={[
          {
            required: true,
            type: "number",
            min: 0,
            max: 99999,
          },
        ]}
        initialValue={8080}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={["platform"]}
        label="Platform"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"Java"}
      >
        <Input />
      </Form.Item>
      <Form.Item name={["serviceDependencies"]} label="Service Dependencies">
        <InputDependency
          serviceDependencies={serviceDependencies}
          setServiceDependencies={setServiceDependencies}
        ></InputDependency>
      </Form.Item>
      <Divider></Divider>
      <Form.Item name={["infrastructure"]} label="Infrastructure">
        <Checkbox.Group options={options} onChange={onChangeCheckBox} />
      </Form.Item>
      <Form.Item
        name={"database"}
        label="Database name"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={"mongodb-nameLTP"}
      >
        <Input addonBefore="mongodb" />
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
