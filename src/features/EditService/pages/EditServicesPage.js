import { Tabs, Layout, Typography } from "antd";
import React from "react";
import EditJson from "../components/EditJson.js";
import EditServiceByForm from "../components/EditServiceByForm";

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
            <EditServiceByForm></EditServiceByForm>
          </Tabs.TabPane>
          <Tabs.TabPane tab="JSON" key="232121231">
            <EditJson />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </div>
  );
}
