import { Tabs, Layout, Typography } from "antd";
import React, { useState, useEffect } from "react";
import AddJson from "../../research/AddServices";
import EditServiceByForm from "../components/EditServiceByForm";
import { get } from "../../../api/axios"
import URL from "../../../api/config"

/* eslint-disable */
const { Content } = Layout;
const { Title } = Typography;

export default function EditServicesPage() {



    return (
        <div>
            <Content
                className="mt-8"
                style={{
                    padding: "0 200px",
                }}
            >
                <Title className="text-center" level={2}>
                    Edit Service
                </Title>
                <Tabs size="large" defaultActiveKey="1">
                    <Tabs.TabPane tab="Form" key="12323">
                        <EditServiceByForm ></EditServiceByForm>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="JSON" key="232121231">
                        <AddJson />
                    </Tabs.TabPane>
                </Tabs>
            </Content>
        </div>
    );
}
