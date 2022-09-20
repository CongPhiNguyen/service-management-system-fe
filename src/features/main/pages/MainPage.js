import {
  Layout,
  Menu,
  Descriptions,
  Divider,
  Tree,
  Button,
  Modal,
  message,
  Typography,
  List,
} from "antd";
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
const { Title } = Typography;
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
  const [currentDisplayService, setCurrentDisplayService] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const getAllService = () => {
      getFix(URL.URL_GET_SERVICE_LIST, {})
        .then((data) => {
          setCurrentServiceList(data.data.services);
        })
        .catch((err) => {
          message.error(err.message);
        });
    };
    getAllService();
  }, []);
  const [arrServiceNameAndId, setArrServiceNameAndId] = useState([]);
  useEffect(() => {
    const arrDependencies = [];
    for (let i = 0; i < currentServiceList.length; i++) {
      if (
        currentSelectedService.requirement.serviceDependencies.includes(
          currentServiceList[i]._id
        )
      ) {
        arrDependencies.push({
          serviceName: currentServiceList[i].serviceName,
          id: currentServiceList[i]._id,
        });
      }
    }
    setArrServiceNameAndId(arrDependencies);
  }, [currentSelectedService]);

  const [arrDenpen, setArrDepen] = useState([]);
  const [arrOwnDepen, setArrOwnDepen] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteService = async () => {
    const arrDependencies = [];
    const arrOwnDependencies = [];
    for (let i = 0; i < currentServiceList.length; i++) {
      if (
        currentSelectedService.requirement.serviceDependencies.includes(
          currentServiceList[i]._id
        )
      ) {
        arrDependencies.push(currentServiceList[i].serviceName);
      }
      if (
        currentSelectedService.requirement.ownDependencies.includes(
          currentServiceList[i]._id
        )
      ) {
        arrOwnDependencies.push(currentServiceList[i].serviceName);
      }
    }
    setArrDepen(arrDependencies);
    setArrOwnDepen(arrOwnDependencies);
    showModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const selectService = (serviceName) => {
    console.log("FUC");
    currentServiceList.forEach((service) => {
      if (service.serviceName === serviceName) {
        setCurrentSelectedService(service);
      }
    });
  };

  const handleOk = async () => {
    await get(URL.URL_DELETE_SERVICE + currentSelectedService._id)
      .then((res) => {
        message.success(
          `Xóa service ${currentSelectedService.serviceName} thành công`
        );
        setCurrentServiceList(res.data.services);
        setCurrentSelectedService({});
      })
      .catch((err) => {
        message.error(err.message);
      });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const renderTreeDescription = (label, val) => {
    return (
      <Descriptions
        contentStyle={{ fontSize: 15, marginBottom: 0 }}
        labelStyle={{ fontSize: 15, fontWeight: 700 }}
      >
        <Descriptions.Item label={label}>
          <a href={"http://" + val} target="_blank">
            {val}
          </a>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const changeCurrentDisplayService = (id) => {
    console.log(id);
    for (const service of currentServiceList) {
      if (service._id === id) {
        setCurrentDisplayService(service);
        return;
      }
    }
  };

  return (
    <div>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {arrDenpen.length !== 0 && (
          <>
            <h6>Các service dependencies bị ảnh hưởng</h6>
            <ul className="list-disc">
              {arrDenpen.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </>
        )}
        {arrOwnDepen.length !== 0 && (
          <>
            <h6>Các service own dependencies bị ảnh hưởng</h6>
            <ul className="list-disc">
              {arrOwnDepen.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </>
        )}
        <h3>Bạn có chắc chắn muốn xóa service?</h3>
      </Modal>
      <Layout className="h-[calc(100vh-64px)] overflow-hidden">
        <Sider className="!w-[200px] overflow-auto">
          <Menu
            mode="inline"
            defaultSelectedKeys={currentServiceList[0]?._id}
            // defaultOpenKeys={["sub1"]}
            style={{ height: "100%" }}
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
          width={350}
          theme="light"
          className="overflow-auto !w-[300px] bg-[white]"
        >
          <Title level={2} className="text-center">
            Information
          </Title>
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
              danger
              onClick={() => deleteService(currentSelectedService._id)}
              type="primary"
            >
              Xóa
            </Button>
          </div>

          {currentSelectedService !== {} &&
            Object.keys(currentSelectedService).length !== 0 && (
              <React.Fragment>
                <Descriptions
                  column={1}
                  className="px-4  py-8"
                  labelStyle={{ fontSize: 16, fontWeight: 700 }}
                  contentStyle={{ fontSize: 16 }}
                >
                  <Descriptions.Item className="py-4" label="Service name">
                    {currentSelectedService.serviceName}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="Author">
                    {currentSelectedService.author + "@taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="Authorized">
                    {currentSelectedService.authorizedPerson + "@taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="Public">
                    {currentSelectedService?.isPublic?.toString()}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="version">
                    {currentSelectedService.version}
                  </Descriptions.Item>
                </Descriptions>
                <Divider className="!mt-[0px]"></Divider>
                <Tree
                  className="!mt-[-20px]"
                  treeData={[
                    {
                      title: (
                        <span className="text-[16px] font-bold">
                          Monitoring
                        </span>
                      ),
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
                            <span className="text-[16px] font-bold mt-[-10px]">
                              Alert bot:{" "}
                              <a
                                className="font-normal"
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
                            <span className="text-[16px] font-bold mt-[-10px] flex">
                              <div>Alert to: </div>
                              <div className="pl-2">
                                {currentSelectedService?.monitoring?.alertTo.map(
                                  (value) => (
                                    <div
                                      key={value}
                                      className="mb-2 font-normal"
                                    >
                                      <a>{value.email}</a>
                                    </div>
                                  )
                                )}
                              </div>
                            </span>
                          ),
                          selectable: false,
                          key: "0-3",
                        },
                      ],
                    },
                  ]}
                />

                <Tree
                  treeData={[
                    {
                      title: (
                        <span className="text-[16px] font-bold">
                          Requirement
                        </span>
                      ),
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
                            <span className="text-[16px] font-bold mt-[-10px]">
                              Infrastructure:{" "}
                              {Object.keys(
                                currentSelectedService?.requirement
                                  ?.infrastructure || {}
                              ).map((value) => {
                                if (
                                  currentSelectedService?.requirement
                                    ?.infrastructure[value] === true
                                )
                                  return (
                                    <span className="font-normal text-red-400">
                                      {value + " "}
                                    </span>
                                  );
                              })}
                            </span>
                          ),
                          key: "0-4",
                        },
                        {
                          title: (
                            <span className="text-[16px] font-bold mt-[-10px]">
                              Database:{" "}
                              {Object.keys(
                                currentSelectedService?.requirement?.database
                              ).map((val) => {
                                return (
                                  <span className="font-normal">
                                    {val} :::{" "}
                                    {
                                      currentSelectedService?.requirement
                                        ?.database[val]?.dbName
                                    }
                                  </span>
                                );
                              })}
                            </span>
                          ),
                          key: "0-5",
                        },
                      ],
                    },
                  ]}
                />
                <Divider className="!mt-[0px]"></Divider>
                <div className="px-[20px]">
                  <List
                    size="small"
                    header={<div className="font-bold">List dependencies</div>}
                    bordered
                    // dataSource={["abc", "abc"]}
                    dataSource={
                      arrServiceNameAndId.length === 0
                        ? []
                        : arrServiceNameAndId.map((value) => value.serviceName)
                    }
                    renderItem={(item) => (
                      <List.Item
                        className="cursor-pointer"
                        onClick={() => selectService(item)}
                      >
                        {item}
                      </List.Item>
                    )}
                  />
                </div>
              </React.Fragment>
            )}
          {Object.keys(currentSelectedService).length === 0 && (
            <div>Select any service to see detail</div>
          )}
        </Sider>
      </Layout>
    </div>
  );
}
