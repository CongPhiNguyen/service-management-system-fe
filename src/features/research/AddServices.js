import React, { useEffect, useState } from "react";

import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import sampleData from "./sampledata";
import ace from "brace";
import "brace/mode/json";
import "brace/theme/github";
import { Button, Segmented, Modal, Typography, message } from "antd";

import { render } from "react-dom";
import AceEditor from "react-ace";

// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-github";

import "ace-builds/src-noconflict/theme-monokai";

export default function AddJson() {
  // console.log(sampleData);
  const [currentSegment, setCurrentSegment] = useState("json_ide");
  const [globalJSONValue, setGlobalJSONValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValidInputJSON, setIsValidInputJSON] = useState(false);

  let editor;
  const handleChange = (value) => {
    console.log(value);
  };

  const checkJSONValid = (text) => {
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

  const addService = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    checkValidation();
    console.log(JSON.parse(globalJSONValue));
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkValidation = () => {
    if (!checkJSONValid(globalJSONValue))
      message.error("File json định dạng lỗi");
    else {
      message.success("Thêm json thành công");
    }
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
            disabled: false,
          },
          {
            label: <div>JSON Editor</div>,
            value: "json_editor",
            disabled: true,
          },
        ]}
        onChange={(value) => {
          console.log(value);
          setCurrentSegment(value);
        }}
      />
      {currentSegment === "json_editor" ? (
        <div>
          <Editor
            value={JSON.parse(globalJSONValue)}
            onChange={(value) => {
              setGlobalJSONValue(JSON.stringify(value));
            }}
          />
          <Button
            onClick={() => {
              console.log("editor", editor.getValue());
              console.log("editor", editor.getValue());
              console.log(checkJSONValid(editor.getValue()));
            }}
          >
            Ủa alo
          </Button>
        </div>
      ) : currentSegment === "json_ide" ? (
        <div>
          <AceEditor
            className="!w-[800px]"
            value={globalJSONValue}
            mode="json"
            theme="monokai"
            onChange={(value) => {
              setIsValidInputJSON(checkJSONValid(value));
              setGlobalJSONValue(value);
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

          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            className="w-[400px]"
          >
            <Typography.Text>
              Bạn có chắc chắn muốn thêm service?
            </Typography.Text>
          </Modal>
        </div>
      ) : null}
    </div>
  );
}
