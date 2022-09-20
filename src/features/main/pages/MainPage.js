import { Layout, Menu, Descriptions, Divider, Tree, Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getFix } from "../../../api/axios";
import URL from "../../../api/config";
import { useNavigate } from "react-router-dom";
import { get } from "../../../api/axios";
import MainDisplay from "../../display/MainDisplay";
import NodeDisplay from "../../display/NodeDisplay";

const { Header, Content, Footer, Sider } = Layout;

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);

const defaultData = [];
const x = 3;
const y = 2;
const z = 1;

export default function MainPage() {
  const [currentServiceList, setCurrentServiceList] = useState([]);
  const [currentSelectedKey, setCurrentSelectedKey] = useState(0);
  const [currentSelectedService, setCurrentSelectedService] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getAllService = () => {
      getFix(URL.URL_GET_SERVICE_LIST, {})
        .then((data) => {
          console.log("data", data);
          setCurrentServiceList(data.data.services);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getAllService();
  }, []);

  const deleteService = async (id) => {
    await get(URL.URL_DELETE_SERVICE + id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderTreeDescription = (label, val) => {
    return (
      <Descriptions
        contentStyle={{ fontSize: 10, marginBottom: 0 }}
        labelStyle={{ fontSize: 10 }}
      >
        <Descriptions.Item label={label}>{val}</Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <div>
      <Layout className="h-[calc(100vh-64px)] overflow-hidden">
        <Sider className="!w-[200px] overflow-auto">
          <Menu
            mode="inline"
            defaultSelectedKeys={currentServiceList[0]?._id}
            className="h-[100%] overflow-y-auto overflow-x-hidden"
            onClick={(value) => {
              // console.log("value", value);
              // setCurrentSelectedKey(value);
              let isFind = false;
              currentServiceList.forEach((service) => {
                if (service._id === value.key) {
                  setCurrentSelectedService(service);
                  isFind = true;
                }
              });
              if (!isFind) {
                setCurrentSelectedService({});
              }
            }}
            items={[
              {
                key: "0",
                label: "All",
              },
              ...currentServiceList.map((value) => {
                return {
                  key: value._id,
                  label: value.serviceName,
                };
              }),
            ]}
          />
        </Sider>
        <Content>
          {Object.keys(currentSelectedService).length === 0 ? (
            <MainDisplay />
          ) : (
            <NodeDisplay nodeID={currentSelectedService._id} />
          )}
        </Content>
        <Sider
          width={250}
          theme="light"
          className="overflow-auto !w-[300px] bg-[white]"
        >
          {currentSelectedService !== {} &&
            Object.keys(currentSelectedService).length !== 0 && (
              <React.Fragment>
                <div className="flex justify-evenly mt-4">
                  <Button
                    onClick={() => {
                      navigate(`/edit-service/${currentSelectedService._id}`);
                    }}
                    type="primary"
                  >
                    Sửa
                  </Button>
                  <Button
                    onClick={() => deleteService(currentSelectedService._id)}
                    type="primary"
                  >
                    Xóa
                  </Button>
                </div>
                <Descriptions
                  column={1}
                  className="px-4 pt-8"
                  labelStyle={{ fontSize: 12, fontWeight: 700 }}
                  contentStyle={{ fontSize: 12 }}
                >
                  <Descriptions.Item label="Service name">
                    {currentSelectedService.serviceName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Author">
                    {currentSelectedService.author + ".taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Authorized">
                    {currentSelectedService.authorizedPerson + ".taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Public">
                    {currentSelectedService?.isPublic?.toString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="version">
                    {currentSelectedService.version}
                  </Descriptions.Item>
                </Descriptions>

                <Divider className="!mt-[0px]"></Divider>

                <Tree
                  className="!mt-[-20px]"
                  treeData={[
                    {
                      title: <span className="text-[12px]">Monitoring</span>,
                      key: "0",
                      children: [
                        {
                          title: renderTreeDescription(
                            "Endpoint PublicUrl",
                            currentSelectedService?.monitoring
                              ?.endpointPublicUrl
                          ),
                          key: "0-0",
                        },
                        {
                          title: renderTreeDescription(
                            "Endpoint PrivateUrl",
                            currentSelectedService?.monitoring
                              ?.endpointPrivateUrl
                          ),
                          key: "0-1",
                        },
                        {
                          title: (
                            <span className="text-[10px] mt-[-10px]">
                              Alert bot:{" "}
                              <a
                                href={
                                  currentSelectedService?.monitoring?.alertBot
                                    ?.botEndpoint
                                }
                                onClick={() => console.log("abc")}
                              >
                                {
                                  currentSelectedService?.monitoring?.alertBot
                                    ?.name
                                }
                              </a>
                            </span>
                          ),
                        },
                        {
                          title: (
                            <span className="text-[10px] mt-[-10px]">
                              Alert to:{" "}
                              {
                                currentSelectedService?.monitoring?.alertTo
                                  .length
                              }
                            </span>
                          ),
                          selectable: false,
                          key: "0-3",
                          children:
                            currentSelectedService?.monitoring?.alertTo.map(
                              (value, index) => {
                                return {
                                  title: renderTreeDescription("Email", value),
                                  key: `0-2-{index}`,
                                };
                              }
                            ),
                        },
                      ],
                    },
                  ]}
                />

                <Tree
                  treeData={[
                    {
                      title: <span className="text-[12px]">Requirement</span>,
                      key: "0",
                      children: [
                        {
                          title: renderTreeDescription(
                            "Domain",
                            currentSelectedService?.requirement?.domain
                          ),
                          key: "0-0",
                        },
                        {
                          title: renderTreeDescription(
                            "Port",
                            currentSelectedService?.requirement?.port
                          ),
                          key: "0-1",
                        },
                        {
                          title: renderTreeDescription(
                            "Platform",
                            currentSelectedService?.requirement?.platform
                          ),
                          key: "0-2",
                        },
                        {
                          title: (
                            <span className="text-[10px]">
                              Infrastructure:{" "}
                              {Object.keys(
                                currentSelectedService?.requirement
                                  ?.infrastructure || {}
                              ).map((value) => {
                                return <span>{value + " "}</span>;
                              })}
                            </span>
                          ),
                          key: "0-4",
                        },
                        {
                          title: (
                            <span className="text-[10px]">
                              Database:{" "}
                              {Object.keys(
                                currentSelectedService?.requirement?.database
                              ).map((val) => {
                                return `${val} ::: ${currentSelectedService?.requirement?.database[val]?.dbName}`;
                              })}
                            </span>
                          ),
                          key: "0-5",
                        },
                      ],
                    },
                  ]}
                />
              </React.Fragment>
            )}
          {Object.keys(currentSelectedService).length === 0 && (
            <div className="p-[10px]">Select any service to see detail</div>
          )}
        </Sider>
      </Layout>
    </div>
  );
}
