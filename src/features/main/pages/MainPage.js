import {
  Layout,
  Menu,
  Descriptions,
  Divider,
  Tree,
  Button,
  Modal,
  message,
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
          console.log("data", data);
          setCurrentServiceList(data.data.services);
          setCurrentSelectedService({});
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getAllService();
  }, []);

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
        contentStyle={{ fontSize: 10, marginBottom: 0 }}
        labelStyle={{ fontSize: 10 }}
      >
        <Descriptions.Item label={label}>{val}</Descriptions.Item>
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
            defaultSelectedKeys={"0"}
            className="h-[100%] overflow-y-auto overflow-x-hidden"
            onClick={(value) => {
              // console.log("value", value);
              // setCurrentSelectedKey(value);
              let isFind = false;
              currentServiceList.forEach((service) => {
                if (service._id === value.key) {
                  setCurrentSelectedService(service);
                  setCurrentDisplayService(service);
                  isFind = true;
                }
              });
              if (!isFind) {
                setCurrentSelectedService({});
                setCurrentDisplayService({});
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
            <MainDisplay changeCurrentService={changeCurrentDisplayService} />
          ) : (
            <NodeDisplay
              changeCurrentService={changeCurrentDisplayService}
              nodeID={currentSelectedService._id}
            />
          )}
        </Content>
        <Sider
          width={250}
          theme="light"
          className="overflow-auto !w-[300px] bg-[white]"
        >
          {currentDisplayService !== {} &&
            Object.keys(currentDisplayService).length !== 0 && (
              <React.Fragment>
                <div className="flex justify-evenly mt-4">
                  <Button
                    onClick={() => {
                      navigate(`/edit-service/${currentDisplayService._id}`);
                    }}
                    type="primary"
                  >
                    Sửa
                  </Button>
                  <Button
                    onClick={() => deleteService(currentDisplayService._id)}
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
                    {currentDisplayService.serviceName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Author">
                    {currentDisplayService.author + ".taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Authorized">
                    {currentDisplayService.authorizedPerson + ".taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Public">
                    {currentDisplayService?.isPublic?.toString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="version">
                    {currentDisplayService.version}
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
                            currentDisplayService?.monitoring?.endpointPublicUrl
                          ),
                          key: "0-0",
                        },
                        {
                          title: renderTreeDescription(
                            "Endpoint PrivateUrl",
                            currentDisplayService?.monitoring
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
                                  currentDisplayService?.monitoring?.alertBot
                                    ?.botEndpoint
                                }
                                onClick={() => console.log("abc")}
                              >
                                {
                                  currentDisplayService?.monitoring?.alertBot
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
                                currentDisplayService?.monitoring?.alertTo
                                  .length
                              }
                            </span>
                          ),
                          selectable: false,
                          key: "0-3",
                          children:
                            currentDisplayService?.monitoring?.alertTo.map(
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
                            currentDisplayService?.requirement?.domain
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
                                currentDisplayService?.requirement?.database
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
          {Object.keys(currentDisplayService).length === 0 && (
            <div className="p-[10px]">Select any service to see detail</div>
          )}
        </Sider>
      </Layout>
    </div>
  );
}
