import { Button } from "antd";
import React, { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { Radio } from "antd";
import D3js from "../d3js/D3js";
import NodeDisplayNormal from "./components/NodeDisplayNormal";
import NodeDisplayReverse from "./components/NodeDisplayReverse";
// const SCREEN_WIDTH = 1000;
// const SCREEN_HEIGHT = 600;

export default function NodeDisplay(props) {
  const [value, setValue] = useState("1");
  const onChangeRadioChecked = (e) => {
    setValue(e.target.value);
  };
  const convasRef = useRef(null);
  const [currentCanvasState, setCurrentCanvasState] = useState({
    stageScale: 1,
    stageX: 0,
    stageY: 0,
  });

  const [change, setChange] = useState("tree");

  const exportPNG = () => {
    function downloadURI(uri, name) {
      var link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    downloadURI(convasRef.current.toDataURL(), "graph");
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.2;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setCurrentCanvasState({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };

  return (
    <div>
      <div className="flex justify-between p-4">
        {change === "network" && (
          <Button
            onClick={() => {
              exportPNG();
            }}
          >
            Download this graph
          </Button>
        )}

        <Radio.Group
          className="!flex !flex-col"
          onChange={onChangeRadioChecked}
          value={value}
        >
          <Radio className={"font-bold"} value={"1"}>
            Own Dependencies
          </Radio>
          <Radio className={"font-bold"} value={"2"}>
            Dependencies
          </Radio>
        </Radio.Group>
        <Button
          style={{ borderRadius: "4px", fontWeight: "600" }}
          className={"rounded-lg"}
          onClick={() => {
            change === "tree" ? setChange("network") : setChange("tree");
          }}
        >
          {change === "tree" ? "network" : "tree"}
        </Button>
      </div>
      {change === "tree" ? (
        <D3js
          id={props.nodeID}
          value={value}
          changeCurrentService={props.changeCurrentService}
        ></D3js>
      ) : (
        <Stage
          width={1900}
          height={1600}
          className="w-[100%] h-[100%]"
          ref={convasRef}
          draggable={true}
          onWheel={handleWheel}
          scaleX={currentCanvasState.stageScale}
          scaleY={currentCanvasState.stageScale}
          x={currentCanvasState.stageX}
          y={currentCanvasState.stageY}
        >
          <Layer>
            {value === "1" ? (
              <NodeDisplayNormal nodeID={props.nodeID} />
            ) : (
              <NodeDisplayReverse nodeID={props.nodeID} />
            )}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
