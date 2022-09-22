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
import { getFix } from "../../../api/axios";
import URL from "../../../api/config";
import { useNavigate } from "react-router-dom";
import { get } from "../../../api/axios";
import MainDisplay from "../../display/MainDisplay";
import NodeDisplay from "../../display/NodeDisplay";
import RemoveAccents from "../../../helper/RemoveAccents";

const { Content, Sider } = Layout;
const { Title } = Typography;
export default function MainPage() {
  const [currentServiceList, setCurrentServiceList] = useState([]);
  const [currentSelectedService, setCurrentSelectedService] = useState({});
  const [currentDisplayService, setCurrentDisplayService] = useState({});
  const [searchServices, setSearchService] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getAllService = () => {
      getFix(URL.URL_GET_SERVICE_LIST, {})
        .then((data) => {
          setCurrentServiceList(data.data.services);
          setSearchService(data.data.services);
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
        currentDisplayService.requirement?.serviceDependencies?.includes(
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
  }, [currentServiceList, currentDisplayService]);

  const [arrDenpen, setArrDepen] = useState([]);
  const [arrOwnDepen, setArrOwnDepen] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteService = async () => {
    const arrDependencies = [];
    const arrOwnDependencies = [];
    for (let i = 0; i < currentServiceList.length; i++) {
      if (
        currentDisplayService.requirement.serviceDependencies.includes(
          currentServiceList[i]._id
        )
      ) {
        arrDependencies.push(currentServiceList[i].serviceName);
      }
      if (
        currentDisplayService.requirement.ownDependencies.includes(
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
    currentServiceList.forEach((service) => {
      if (service.serviceName === serviceName) {
        setCurrentSelectedService(service);
        setCurrentDisplayService(service);
      }
    });
  };

  const handleOk = async () => {
    await get(URL.URL_DELETE_SERVICE + currentDisplayService._id)
      .then((res) => {
        message.success(
          `Xóa service ${currentDisplayService.serviceName} thành công`
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
          <a href={"http://" + val} target="_blank" rel="noreferrer">
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

  const handleChangeSearch = (e) => {
    if (e.target.value.length === 0) {
      setSearchService(currentServiceList);
    } else {
      let arr = currentServiceList.filter((service) => {
        if (
          RemoveAccents(service.serviceName).includes(
            RemoveAccents(e.target.value)
          )
        )
          return true;
        return false;
      });
      setSearchService(arr);
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
        <h3>
          Bạn có chắc chắn muốn xóa service {currentDisplayService.serviceName}?
        </h3>
      </Modal>
      <Layout className="h-[calc(100vh-64px)] overflow-hidden">
        <Sider width={250} className="!w-[200px] overflow-hidden">
          <div className="bg-[#fff] flex justify-center">
            <input
              onChange={handleChangeSearch}
              placeholder="Search service..."
              className="w-[80%] outline-none rounded-xl border-solid border-[1px] border-[#605b0f] p-2 px-4 my-2"
              type={"text"}
            />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={"0"}
            selectedKeys={
              currentSelectedService._id ? currentSelectedService._id : "0"
            }
            className="overflow-auto"
            style={{ height: "100%" }}
            onClick={(value) => {
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
              ...searchServices.map((value) => {
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
          width={350}
          theme="light"
          className="overflow-auto !w-[300px] bg-[white]"
        >
          <Title level={2} className="text-center">
            Information
          </Title>

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
                    danger
                    onClick={() => deleteService(currentDisplayService._id)}
                    type="primary"
                  >
                    Xóa
                  </Button>
                </div>
                <Descriptions
                  column={1}
                  className="px-4  py-8"
                  labelStyle={{ fontSize: 16, fontWeight: 700 }}
                  contentStyle={{ fontSize: 16 }}
                >
                  <Descriptions.Item className="py-4" label="Service name">
                    {currentDisplayService.serviceName}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="Author">
                    {currentDisplayService.author + "@taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="Authorized">
                    {currentDisplayService.authorizedPerson + "@taptap.com.vn"}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="Public">
                    {currentDisplayService?.isPublic?.toString()}
                  </Descriptions.Item>
                  <Descriptions.Item className="py-4" label="version">
                    {currentDisplayService.version}
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
                            <span className="text-[16px] font-bold mt-[-10px]">
                              Alert bot:{" "}
                              <a
                                className="font-normal"
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
                            <span className="text-[16px] font-bold mt-[-10px] flex">
                              <div>Alert to: </div>
                              <div className="pl-2">
                                {currentDisplayService?.monitoring?.alertTo.map(
                                  (value) => (
                                    <div
                                      key={value}
                                      className="mb-2 font-normal"
                                    >
                                      <p>{value.email}</p>
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
                            currentDisplayService?.requirement?.domain
                          ),
                          key: "0-0",
                        },
                        {
                          title: renderTreeDescription(
                            "Port",
                            currentDisplayService?.requirement?.port
                          ),
                          key: "0-1",
                        },
                        {
                          title: renderTreeDescription(
                            "Platform",
                            currentDisplayService?.requirement?.platform
                          ),
                          key: "0-2",
                        },
                        {
                          title: (
                            <span className="text-[16px] font-bold mt-[-10px]">
                              Infrastructure:{" "}
                              {Object.keys(
                                currentDisplayService?.requirement
                                  ?.infrastructure || {}
                              ).map((value) => {
                                if (
                                  currentDisplayService?.requirement
                                    ?.infrastructure[value] === true
                                )
                                  return (
                                    <span className="font-normal text-red-400">
                                      {value + " "}
                                    </span>
                                  );
                                return null;
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
                                currentDisplayService?.requirement?.database
                              ).map((val) => {
                                return (
                                  <span className="font-normal">
                                    {val} :::{" "}
                                    {
                                      currentDisplayService?.requirement
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
          {Object.keys(currentDisplayService).length === 0 && (
            <p className="text-center">Select any service to see detail</p>
          )}
        </Sider>
      </Layout>
    </div>
  );
}
