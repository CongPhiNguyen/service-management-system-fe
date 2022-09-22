import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Arrow } from "react-konva";
import { getFix } from "../../api/axios";
import URL from "../../api/config";
import { Button } from "antd";

export default function MainDisplay(props) {
  const [currentSelectNodeID, setCurrentSelectNodeID] = useState(null);
  const [serviceNodes, setServiceNodes] = useState([]);
  const [serviceRelations, setServiceRelations] = useState([]);

  const convasRef = useRef(null);

  const createServiceNodes = (services) => {
    const serviceNodesTemp = services.map((val, index) => {
      return {
        index: index,
        _id: val._id,
        name: val.serviceName,
        x: ((index * 1000) % 70) * 10 + 20,
        y: ((index * 1000) % 30) * 10 + 20,
        color: randomColor(),
        dependFor: val.requirement.serviceDependencies,
      };
    });
    setServiceNodes(serviceNodesTemp);
    makeServiceRelation(serviceNodesTemp);
  };

  const makeServiceRelation = (serviceNodes) => {
    const serviceRelationTemp = [];
    const objectFind = {};
    for (let i = 0; i < serviceNodes.length; i++) {
      objectFind[serviceNodes[i]._id] = serviceNodes[i];
    }

    for (let i = 0; i < serviceNodes.length; i++) {
      const dependFor = serviceNodes[i].dependFor;
      for (let j = 0; j < dependFor.length; j++) {
        console.log("a");
        serviceRelationTemp.push({
          pointA: objectFind[serviceNodes[i]._id],
          pointB: objectFind[dependFor[j]],
          isSelectA: currentSelectNodeID === dependFor[j],
          isSelectB: currentSelectNodeID === serviceNodes[i]._id,
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
    const getAllService = () => {
      getFix(URL.URL_GET_SERVICE_LIST, {})
        .then((data) => {
          createServiceNodes(data.data.services);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getAllService();
  }, []);

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

  return (
    <div className="relative">
      <Button className="!absolute">Download this graph</Button>
      <Stage
        width={1900}
        height={1600}
        className="w-[100%] h-[100%] bg-[#f0f2f5]"
        color="#f0f2f5"
        draggable={true}
        ref={convasRef}
      >
        <Layer>
          {serviceNodes.map((val, index) => {
            return (
              <React.Fragment>
                <Circle
                  x={((index * 1000) % 70) * 10 + 20}
                  y={((index * 1000) % 30) * 10 + 20}
                  fill={val.color}
                  stroke={
                    val._id === currentSelectNodeID ? "red" : "transparent"
                  }
                  // strokeWidth={"20px"}
                  // shadowBlur={val._id === currentSelectNodeID ? "10px" : "0px"}
                  radius={20}
                  draggable={true}
                  onClick={() => {
                    props.changeCurrentService(val._id);
                    setCurrentSelectNodeID(val._id);
                    makeServiceRelation(serviceNodes);
                  }}
                  onDragMove={(e) => {
                    setServiceNodes((prev) => {
                      return prev.map((val) => {
                        if (val.index === index) {
                          val.x = e.target.x();
                          val.y = e.target.y();
                        }
                        return val;
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
                  stroke={val.isSelectA || val.isSelectB ? "red" : "black"}
                  fill={val.isSelectA || val.isSelectB ? "red" : "black"}
                />
              );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
