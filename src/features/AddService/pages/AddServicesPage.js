import { Tabs, Layout, Typography } from "antd";
import React from "react";
import AddJson from "../components/AddJson";
import AddServiceByForm from "../components/AddServiceByForm";
/* eslint-disable */
const { Content } = Layout;
const { Title } = Typography;

export default function AddServicesPage() {
  return (
    <div>
      <Content
        className="mt-8"
        style={{
          padding: "0 200px",
        }}
      >
        <Title className="text-center mb-[20px]" level={2}>
          ADD NEW SERVICE
        </Title>
        <Tabs size="large" defaultActiveKey="1">
          <Tabs.TabPane tab="Form" key="12323">
            <AddServiceByForm></AddServiceByForm>
          </Tabs.TabPane>
          <Tabs.TabPane tab="JSON" key="232121231">
            <AddJson />
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </div>
  );
}
