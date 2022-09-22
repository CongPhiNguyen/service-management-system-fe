import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Arrow } from "react-konva";
import { Radio } from "antd";
import { getFix } from "../../api/axios";
import URL from "../../api/config";
import D3js from "../d3js/D3js";
const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 600;

export default function NodeDisplay(props) {
  // console.log("props", props);
  const [value, setValue] = useState("1");
  const onChangeRadioChecked = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const [currentServiceList, setCurrentServiceList] = useState([]);
  const [serviceNodes, setServiceNodes] = useState([]);
  const [serviceRelations, setServiceRelations] = useState([]);

  const createServiceNodesTree = (depen, current) => {
    console.log("depen", depen);
    console.log("current", current);

    let serviceNodesTemp = [];

    serviceNodesTemp.push({
      index: 0,
      _id: current._id,
      name: current.name,
      x: SCREEN_WIDTH / 2,
      y: 100 / 2,
      initX: SCREEN_WIDTH / 2,
      initY: 100 / 2,
      color: randomColor(),
      dependFor: depen.map((val) => val._id),
    });

    const makeDepenNode = (node, beginX, endX, depth) => {
      let depenNodeRender = [];
      let currentDepen = node.dependences;
      console.log("currentDepen", currentDepen);
      for (let i = 0; i < currentDepen.length; i++) {
        depenNodeRender.push(
          ...makeDepenNode(
            currentDepen[i],
            beginX + (i * (endX - beginX)) / currentDepen.length,
            beginX + ((i + 1) * (endX - beginX)) / currentDepen.length,
            depth + 1
          )
        );
      }
      // console.log("depenNodeRender", depenNodeRender);
      return [
        {
          index: 0,
          _id: node._id,
          name: node.name,
          x: beginX + (endX - beginX) / 2,
          y: depth * 100 + 50,
          initX: beginX + (endX - beginX) / 2,
          initY: depth * 100 + 50,
          color: randomColor(),
          dependFor: node.dependences.map((val) => val._id),
        },
        ...depenNodeRender,
      ];
    };

    for (let i = 0; i < depen.length; i++) {
      console.log("depen", i, depen[i]);
      serviceNodesTemp.push(
        ...makeDepenNode(
          depen[i],
          0 + (i * (SCREEN_WIDTH - 0)) / depen.length,
          0 + ((i + 1) * (SCREEN_WIDTH - 0)) / depen.length,
          1
        )
      );
    }

    // console.log("serviceNodesTemp", serviceNodesTemp);
    let setID = [];
    serviceNodesTemp = serviceNodesTemp.filter((val) => {
      if (setID.includes(val._id)) {
        return false;
      } else {
        setID.push(val._id);
        return true;
      }
    });
    makeServiceRelation(serviceNodesTemp);
    setServiceNodes(serviceNodesTemp);
  };

  const makeServiceRelation = (serviceNodes) => {
    console.log("serviceNodes", serviceNodes);
    const serviceRelationTemp = [];
    // console.log("serviceNodes abc", serviceNodes);
    const objectFind = {};
    for (let i = 0; i < serviceNodes.length; i++) {
      if (!objectFind[serviceNodes[i]._id])
        objectFind[serviceNodes[i]._id] = serviceNodes[i];
    }
    console.log("objectFind", objectFind);

    for (let i = 0; i < serviceNodes.length; i++) {
      const dependFor = serviceNodes[i].dependFor;
      for (let j = 0; j < dependFor.length; j++) {
        console.log("dependFor[i]", dependFor[i]);
        serviceRelationTemp.push({
          pointA: objectFind[serviceNodes[i]._id],
          pointB: objectFind[dependFor[j]],
        });
      }
    }
    console.log("serviceRelationTemp", serviceRelationTemp);
    setServiceRelations(serviceRelationTemp);
  };

  function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    setServiceNodes([]);
    const getServiceTree = () => {
      getFix(URL.URL_GET_SERVICE_TREE_REVERSE, { id: props.nodeID })
        .then((data) => {
          if (data.data.success) {
            createServiceNodesTree(data.data.depen, data.data.current);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getServiceTree();
  }, [props.nodeID]);

  // console.log("serviceNodes", serviceNodes);

  const randomColor = () => {
    return `rgb(${randomIntFromRange(0, 255)},${randomIntFromRange(
      0,
      255
    )},${randomIntFromRange(0, 255)})`;
  };

  const calculatePoint = (pointA, pointB) => {
    const longLine = Math.sqrt(
      (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2
    );
    return [
      pointA.x - (20 * (pointA.x - pointB.x)) / longLine,
      pointA.y - (20 * (pointA.y - pointB.y)) / longLine,
      pointB.x + (20 * (pointA.x - pointB.x)) / longLine,
      pointB.y + (20 * (pointA.y - pointB.y)) / longLine,
    ];
  };
  const [change, setChange] = useState("tree");

  return (
    <div>
      <div className="flex justify-between p-4">
        <Radio.Group
          className="!flex !flex-col"
          onChange={onChangeRadioChecked}
          value={value}
        >
          <Radio className={"font-bold"} value={"1"}>
            Own Dependencies
          </Radio>
          <Radio className={"font-bold"} value={"2"}>
            Service Dependencies
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
        <Stage width={1900} height={1600} className="w-[100%] h-[100%]">
          <Layer>
            {serviceNodes.map((val, index) => {
              // console.log("val", val);
              return (
                <React.Fragment>
                  <Circle
                    x={val.initX}
                    y={val.initY}
                    fill={val.color}
                    radius={20}
                    draggable={true}
                    onClick={() => {
                      props.changeCurrentService(val._id);
                    }}
                    onDragMove={(e) => {
                      setServiceNodes((prev) => {
                        return prev.map((currentVal) => {
                          if (currentVal._id === val._id) {
                            currentVal.x = e.target.x();
                            currentVal.y = e.target.y();
                          }
                          return currentVal;
                        });
                      });
                    }}
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = "grab";
                    }}
                    onMouseLeave={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = "default";
                    }}
                  />
                  <Text x={val.x + 20} y={val.y} text={val.name} />
                </React.Fragment>
              );
            })}
            {serviceRelations.map((val, index) => {
              if (val.pointA && val.pointB)
                return (
                  <Arrow
                    points={calculatePoint(val.pointA, val.pointB)}
                    stroke="black"
                    fill="black"
                  />
                );
            })}
            {serviceRelations.map((val, index) => {
              if (val.pointA && val.pointB)
                return (
                  <Arrow
                    points={calculatePoint(val.pointA, val.pointB)}
                    stroke="black"
                    fill="black"
                  />
                );
            })}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
