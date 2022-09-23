import React, { useEffect, useState } from "react";
/* eslint-disable no-unused-vars */
import ace from "brace";
/* eslint-enable no-unused-vars */
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import { Button, Segmented, Modal, Typography, message } from "antd";
import "brace/mode/json";
import "brace/theme/github";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import { post, get } from "../../../api/axios";
import URL from "../../../api/config";
import { useNavigate, useParams } from "react-router-dom";

export default function EditJson() {
  const params = useParams();
  const navigate = useNavigate();
  // console.log(sampleData);
  const [currentSegment, setCurrentSegment] = useState("json_ide");
  const [disableConvert, setDisableConvert] = useState(true);
  const [globalJSONValue, setGlobalJSONValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidInputJSON, setIsValidInputJSON] = useState(true);
  const [allServices, setAllServices] = useState([]);
  const [currentEditService, setCurrentEditService] = useState({});

  useEffect(() => {
    const getAllService = async () => {
      get(URL.URL_GET_ALL_SERVICE)
        .then((res) => {
          console.log(res.data.services);
          setAllServices(res.data.services);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("allServices", allServices);

  const makeInitJSON = (service) => {
    console.log("service", service);
    service.requirement.serviceDependencies =
      service.requirement.serviceDependencies.map((val) => {
        // console.log("val", val);
        return val.serviceName;
      });
    delete service.requirement.ownDependencies;
    return JSON.stringify(service, null, "\t");
  };

  useEffect(() => {
    const getEditService = () => {
      get(URL.URL_GET_SERVICE + params.id)
        .then((data) => {
          // console.log("data.data.service", data.data.service);
          // console.log(JSON.stringify(data.data.service, null, "\t"));
          setGlobalJSONValue(makeInitJSON(data.data.service));
          setCurrentEditService(data.data.service);
          // if (res.data.service) {
          //   // setService(res.data.service)
          //   setServiceDependencies(
          //     res.data.service.requirement.serviceDependencies.map(
          //       (service) => {
          //         return service.serviceName;
          //       }
          //     )
          //   );
          // }
          // console.log("res", res);
        })
        .catch((err) => {
          message.error(err.message);
        });
    };
    getEditService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkJSONValid = (text) => {
    if (text.length === 0) return false;
    try {
      JSON.parse(text);
    } catch (e) {
      return false;
    }
    return true;
  };

  const checkIsValidServices = (value) => {
    const val = JSON.parse(value);
    if (!val.serviceName || val.serviceName.length === 0) {
      return {
        valid: false,
        message: "The serviceName is not found or blank",
      };
    }
    if (!val.author || val.author.length === 0) {
      return {
        valid: false,
        message: "The author email is not found or blank",
      };
    }
    if (!val.authorizedPerson || val.authorizedPerson.length === 0) {
      return {
        valid: false,
        message: "The authorized person email is not found or blank",
      };
    }
    if (val.isPublic === undefined) {
      return {
        valid: false,
        message: "Service status is null",
      };
    }

    const checkBlankWithZeroLength = (val, valueString) => {
      if (val === undefined || val === null)
        return {
          valid: false,
          message: `${valueString} is undefined`,
        };
      else
        return {
          valid: true,
        };
    };

    const checkBlank = (val, valueString) => {
      if (val === undefined || val === null || val.length === 0)
        return {
          valid: false,
          message: `${valueString} is null or undefined`,
        };
      else
        return {
          valid: true,
        };
    };

    let checkStep = checkBlank(val.version, "Version");
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(
      val.monitoring?.endpointPublicUrl,
      "Monitoring endpointPublicUrl"
    );
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(
      val.monitoring?.endpointPrivateUrl,
      "Monitoring endpointPrivateUrl"
    );
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlankWithZeroLength(
      val.monitoring?.alertTo,
      "Monitoring alert"
    );
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(val.monitoring?.alertBot, "Monitoring alert bot");
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(val.requirement?.domain, "Service domain");
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(val.requirement?.port, "Service port");
    try {
      if (!/^\d+$/.test(val.requirement?.port)) throw Error();
    } catch (err) {
      return {
        valid: false,
        message: "Service port not valid",
      };
    }
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(val.requirement?.platform, "Service platform");
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlankWithZeroLength(
      val.requirement?.serviceDependencies,
      "Service serviceDependencies"
    );
    if (!checkStep.valid) return checkStep;
    console.log(
      "val.requirement?.serviceDependencies",
      val.requirement?.serviceDependencies
    );
    for (const depen of val.requirement?.serviceDependencies) {
      let isFind = false;
      for (const service of allServices) {
        console.log(depen, service.serviceName);
        if (depen === service.serviceName) {
          isFind = true;
        }
      }
      if (!isFind) {
        return {
          valid: false,
          message: "The service dependency Names is not found",
        };
      }
    }

    checkStep = checkBlankWithZeroLength(
      val.requirement?.serviceDependencies,
      "Service Dependencies"
    );
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(
      val.requirement?.infrastructure,
      "Service Infrastructure"
    );
    if (!checkStep.valid) return checkStep;

    checkStep = checkBlank(val.requirement?.database, "Service database");
    if (!checkStep.valid) return checkStep;

    return {
      valid: true,
    };
  };

  const addService = () => {
    setIsModalOpen(true);
  };

  const editServiceAPI = (data) => {
    post(URL.URL_EDIT_SERVICE + params.id, { ...data })
      .then((res) => {
        if (res.data.status === 0) {
          if (res.data.deadlock) {
            res.data.deadlock.forEach((deadlock) => {
              if (deadlock.deadlock === true) {
                message.error(
                  `Việc thêm service ${deadlock.serviceName} vào dependencies xảy ra deadlock`
                );
              }
            });
          } else {
            message.error(res.data.message);
          }
        } else {
          message.success(
            `Service ${currentEditService.serviceName} chỉnh sửa thành công!`
          );
          navigate("/service-management");
        }
        setIsModalOpen(false);
      })
      .catch((err) => {
        message.error(err.message);
        setIsModalOpen(false);
      });
  };

  const addServiceHandle = () => {
    if (!checkJSONValid(globalJSONValue))
      message.error("File json định dạng lỗi");

    const resCheckValid = checkIsValidServices(globalJSONValue);
    // console.log(globalJSONValue);
    if (resCheckValid.valid) {
      message.success("Thêm json thành công");
      const globalObjectValue = JSON.parse(globalJSONValue);
      console.log(JSON.parse(globalJSONValue));
      const addData2 = {
        alertTo: globalObjectValue.monitoring.alertTo.map((val) => {
          return {
            name: val.name,
            email:
              val.email.indexOf("@taptap") >= 0
                ? val.email.slice(0, val.email.indexOf("@taptap"))
                : val.email,
            phone: val.phone,
          };
        }),
        authorizedPerson: globalObjectValue.authorizedPerson.slice(
          0,
          globalObjectValue.authorizedPerson.indexOf("@taptap")
        ),
        author: globalObjectValue.author.slice(
          0,
          globalObjectValue.author.indexOf("@taptap")
        ),
        database: globalObjectValue.requirement.database.mongodb.dbName,
        domain: globalObjectValue.requirement.domain,
        endpointPrivateUrl: globalObjectValue.monitoring.endpointPrivateUrl,
        endpointPublicUrl: globalObjectValue.monitoring.endpointPublicUrl,
        infrastructure: Object.keys(
          globalObjectValue.requirement.infrastructure
          // eslint-disable-next-line
        ).map((val) => {
          if (globalObjectValue.requirement.infrastructure[val] !== undefined) {
            return val;
          }
        }),
        isPublic: globalObjectValue.isPublic,
        botEndpoint: globalObjectValue.monitoring.alertBot.botEndpoint,
        nameBot: globalObjectValue.monitoring.alertBot.name,
        platform: globalObjectValue.requirement.platform,
        port: globalObjectValue.requirement.port,
        serviceDependencies: globalObjectValue.requirement.serviceDependencies,
        serviceName: globalObjectValue.serviceName,
        version: globalObjectValue.version,
      };
      editServiceAPI(addData2);
    } else {
      message.error(resCheckValid.message);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log();

  return (
    <div>
      <Segmented
        options={[
          // {
          //   label: <div>Upload</div>,
          //   value: "upload_file",
          // },
          {
            label: <div>JSON IDE</div>,
            value: "json_ide",
            disabled: currentSegment !== "json_ide" && disableConvert,
          },
          {
            label: <div>JSON Editor</div>,
            value: "json_editor",
            disabled: currentSegment !== "json_editor" && disableConvert,
          },
        ]}
        onChange={(value) => {
          console.log(value);
          setCurrentSegment(value);
          setGlobalJSONValue((prev) => {
            return JSON.stringify(JSON.parse(prev), null, "\t");
          });
        }}
      />
      {currentSegment === "json_editor" ? (
        <div>
          <Editor
            value={JSON.parse(globalJSONValue)}
            onChange={(value) => {
              try {
                JSON.stringify(value);
                setGlobalJSONValue(JSON.stringify(value));
                if (checkJSONValid(JSON.stringify(value)))
                  setDisableConvert(false);
                else setDisableConvert(true);
              } catch (err) {
                setDisableConvert(true);
              }
            }}
          />
          <div className="button-container mt-2 flex ">
            <Button
              type="primary"
              onClick={addService}
              disabled={!isValidInputJSON}
            >
              Edit service
            </Button>
          </div>
        </div>
      ) : currentSegment === "json_ide" ? (
        <div>
          <AceEditor
            className="!w-[800px] !h-[300px]"
            value={globalJSONValue}
            mode="json"
            theme="monokai"
            onChange={(value) => {
              setIsValidInputJSON(checkJSONValid(value));
              setGlobalJSONValue(value);
              if (checkJSONValid(value)) setDisableConvert(false);
              else setDisableConvert(true);
            }}
            name="UNIQUE_ID_OF_DIV"
            fontSize={14}
            highlightActiveLine={true}
            editorProps={{ $blockScrolling: true }}
          />
          <div className="button-container mt-2 flex ">
            <Button
              type="primary"
              onClick={addService}
              disabled={!isValidInputJSON}
            >
              Edit service
            </Button>
          </div>
        </div>
      ) : null}
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={addServiceHandle}
        onCancel={handleCancel}
        className="w-[400px]"
      >
        <Typography.Text>Bạn có chắc chắn muốn thêm service?</Typography.Text>
      </Modal>
    </div>
  );
}
