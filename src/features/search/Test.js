import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import { getFix } from "../../api/axios";
import URL from "../../api/config";

export default function Test() {
  const [currentJSONValue, setCurrentJSONValue] = useState();
  useEffect(() => {
    getFix(URL.URL_GET_SERVICE_TREE, { id: "63229e88476b98d97e84a1a6" })
      .then((res) => {
        setCurrentJSONValue(JSON.stringify(res));
        console.log("res.data", res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return (
    <div>
      <AceEditor
        className="!w-[800px]"
        value={currentJSONValue}
        mode="json"
        theme="monokai"
        // onChange={(value) => {
        //   setIsValidInputJSON(checkJSONValid(value));
        //   setGlobalJSONValue(value);
        // }}
        name="UNIQUE_ID_OF_DIV"
        fontSize={16}
        highlightActiveLine={true}
        editorProps={{ $blockScrolling: true }}
      />
    </div>
  );
}
