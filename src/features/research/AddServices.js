import React, { useEffect, useState } from "react";

import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import sampleData from "./sampledata";
import { Button, Segmented, Modal, Typography, message } from "antd";

import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-monokai";
import { FastBackwardFilled } from "@ant-design/icons";

export default function AddJson() {
  // console.log(sampleData);
  const [currentSegment, setCurrentSegment] = useState("json_ide");
  const [disableConvert, setDisableConvert] = useState(true);
  const [globalJSONValue, setGlobalJSONValue] = useState("");
  const [globalObjectValue, setGlobalObjectValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidInputJSON, setIsValidInputJSON] = useState(false);

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

    if (val.version == undefined) {
      return {
        valid: false,
        message: "Version is null",
      };
    }

    if (val.monitoring?.endpointPublicUrl === undefined) {
      return {
        valid: false,
        message: "Monitoring endpointPublicUrl is null",
      };
    }

    if (val.monitoring?.endpointPrivateUrl === undefined) {
      return {
        valid: false,
        message: "Monitoring endpointPrivateUrl is null",
      };
    }

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

    if (resCheckValid.valid) {
      message.success("Thêm json thành công");
    } else {
      message.error(resCheckValid.message);
    }
    // console.log(JSON.parse(globalJSONValue));
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
            <Button onClick={makeDefaultTemplate}>Use default</Button>
            <Button
              type="primary"
              onClick={addService}
              disabled={!isValidInputJSON}
            >
              Add service
            </Button>
          </div>
        </div>
      ) : currentSegment === "json_ide" ? (
        <div>
          <AceEditor
            className="!w-[800px] !h-[300px]"
            value={
              globalJSONValue
              //  === ""
              //   ? ""
              //   :
            }
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
            <Button onClick={makeDefaultTemplate}>Use default</Button>
            <Button
              type="primary"
              onClick={addService}
              disabled={!isValidInputJSON}
            >
              Add service
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
