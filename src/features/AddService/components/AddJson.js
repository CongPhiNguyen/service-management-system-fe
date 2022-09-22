import React, { useEffect, useState } from "react";
import ace from "brace";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import sampleData from "./sampledata";
import { Button, Segmented, Modal, Typography, message } from "antd";
import "brace/mode/json";
import "brace/theme/github";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import { post, get } from "../../../api/axios";
import URL from "../../../api/config";
export default function AddJson() {
  // console.log(sampleData);
  const [currentSegment, setCurrentSegment] = useState("json_ide");
  const [disableConvert, setDisableConvert] = useState(true);
  const [globalJSONValue, setGlobalJSONValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidInputJSON, setIsValidInputJSON] = useState(false);
  const [allServices, setAllServices] = useState([]);

  const [isOpenModalConfirmUseDefault, setOpenModalConfirmUseDefault] =
    useState(false);
  const [useDefaultClicked, setUseDefaultTimeClicked] = useState(false);

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

  const makeDefaultTemplate = () => {
    setGlobalJSONValue(sampleData);
    setIsValidInputJSON(true);
    setDisableConvert(false);
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
    const regexTestEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regexTestEmail.test(val.author)) {
      return {
        valid: false,
        message: "Author email format not valid",
      };
    }
    if (!regexTestEmail.test(val.authorizedPerson)) {
      return {
        valid: false,
        message: "Authorized email format not valid",
      };
    }
    if (val.isPublic == undefined) {
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
    for (const depen of val.requirement?.serviceDependencies) {
      let isFind = false;
      for (const service of allServices) {
        if (depen.name === service.serviceName) {
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

  const addServiceHandle = () => {
    if (!checkJSONValid(globalJSONValue))
      message.error("File json định dạng lỗi");

    const resCheckValid = checkIsValidServices(globalJSONValue);
    console.log(globalJSONValue);
    if (resCheckValid.valid) {
      message.success("Thêm json thành công");
      const globalObjectValue = JSON.parse(globalJSONValue);
      console.log(JSON.parse(globalJSONValue));
      const addData2 = {
        alertTo: globalObjectValue.monitoring.alertTo.map((val) => {
          return {
            name: val.name,
            email: val.email.slice(0, val.email.indexOf("@taptap")),
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
        serviceDependencies:
          globalObjectValue.requirement.serviceDependencies.map((val) => {
            for (const service of allServices) {
              if (service.serviceName === val.name) return service.serviceName;
            }
          }),
        serviceName: globalObjectValue.serviceName,
        version: globalObjectValue.version,
      };
      post(URL.URL_ADD_NEW_SERVICE, addData2)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      message.error(resCheckValid.message);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
        </div>
      ) : null}
      <div className="button-container mt-2 flex ">
        <Button
          onClick={() => {
            if (useDefaultClicked) {
              setOpenModalConfirmUseDefault(true);
            } else {
              makeDefaultTemplate();
            }
            setUseDefaultTimeClicked(true);
          }}
        >
          Use default
        </Button>
        <Button
          type="primary"
          onClick={addService}
          disabled={!isValidInputJSON}
        >
          Add service
        </Button>
      </div>
      <Modal
        title="Thêm service"
        open={isModalOpen}
        onOk={addServiceHandle}
        onCancel={handleCancel}
        className="w-[400px]"
      >
        <Typography.Text>Bạn có muốn thêm service?</Typography.Text>
      </Modal>
      <Modal
        title="Xác nhận"
        open={isOpenModalConfirmUseDefault}
        onOk={() => {
          makeDefaultTemplate();
          setOpenModalConfirmUseDefault(false);
        }}
        onCancel={() => {
          setOpenModalConfirmUseDefault(false);
        }}
        className="w-[400px]"
      >
        <Typography.Text>
          Bạn có muốn xóa hết những thay đổi để đưa về template?
        </Typography.Text>
      </Modal>
    </div>
  );
}
