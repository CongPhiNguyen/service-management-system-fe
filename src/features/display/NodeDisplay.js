import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Arrow } from "react-konva";
import { getFix } from "../../api/axios";
import URL from "../../api/config";

export default function NodeDisplay(props) {
  console.log("props", props);

  const [currentServiceList, setCurrentServiceList] = useState([]);

  const [serviceNodes, setServiceNodes] = useState([]);
  const [serviceRelations, setServiceRelations] = useState([]);

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
    // console.log("serviceNodesTemp", serviceNodesTemp);
    setServiceNodes(serviceNodesTemp);
    makeServiceRelation(serviceNodesTemp);
  };

  const makeServiceRelation = (serviceNodes) => {
    const serviceRelationTemp = [];
    // console.log("serviceNodes abc", serviceNodes);
    const objectFind = {};
    for (let i = 0; i < serviceNodes.length; i++) {
      objectFind[serviceNodes[i]._id] = serviceNodes[i];
    }
    // console.log("objectFind", objectFind);

    for (let i = 0; i < serviceNodes.length; i++) {
      const dependFor = serviceNodes[i].dependFor;
      for (let j = 0; j < dependFor.length; j++) {
        // console.log(objectFind[serviceNodes[i]._id], objectFind[dependFor[j]]);
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
    const getServiceTree = () => {
      getFix(URL.URL_GET_SERVICE_TREE, { id: props.nodeID })
        .then((data) => {
          console.log("data", data);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getServiceTree();
  }, []);

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

  return (
    <div>
      <Stage width={1900} height={1600} className="w-[100%] h-[100%]">
        <Layer>
          {serviceNodes.map((val, index) => {
            return (
              <React.Fragment>
                <Circle
                  x={((index * 1000) % 70) * 10 + 20}
                  y={((index * 1000) % 30) * 10 + 20}
                  fill={val.color}
                  radius={20}
                  draggable={true}
                  onClick={() => {
                    props.changeCurrentService(val._id);
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
        </Layer>
      </Stage>
    </div>
  );
}
