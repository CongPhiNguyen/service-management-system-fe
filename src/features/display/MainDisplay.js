import React, { useEffect, useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Arrow } from "react-konva";
import { getFix } from "../../api/axios";
import URL from "../../api/config";

export default function MainDisplay() {
  const [currentServiceList, setCurrentServiceList] = useState([]);
  const [listPosition, changeListPosition] = useState([
    {
      value: 1,
      x: 100,
      y: 200,
    },
    {
      value: 2,
      x: 200,
      y: 200,
    },
  ]);

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
    console.log("serviceNodesTemp", serviceNodesTemp);
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
    console.log("objectFind", objectFind);

    for (let i = 0; i < serviceNodes.length; i++) {
      const dependFor = serviceNodes[i].dependFor;
      for (let j = 0; j < dependFor.length; j++) {
        serviceRelationTemp.push({
          pointA: objectFind[serviceNodes[i]._id],
          pointB: objectFind[dependFor[j]],
        });
      }
    }
    // for (let i = 0; i < serviceNodes.length; i++) {
    //   const serviceDepen = serviceNodes[i]?.depenFor;

    //   if (serviceDepen.length > 0) {
    //     for (let i = 0; i < serviceDepen.length; i++) {
    //       console.log(
    //         "serviceDepen",
    //         serviceNodes[i].name,
    //         serviceNodes[i]._id,
    //         serviceDepen
    //       );
    //       console.log(serviceDepen[i], serviceNodes[i]._id);
    //       serviceRelationTemp.push({
    //         pointA: objectFind[serviceDepen[i]],
    //         pointB: objectFind[serviceNodes[i]._id],
    //       });
    //     }
    //   }
    // }
    console.log("serviceRelationTemp", serviceRelationTemp);
    setServiceRelations(serviceRelationTemp);
  };

  function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    const getServiceTree = () => {
      getFix(URL.URL_GET_SERVICE_TREE, { id: "632822a9981b22e2611c0c68" })
        .then((data) => {
          console.log("data", data);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getServiceTree();
  }, []);

  useEffect(() => {
    const getAllService = () => {
      getFix(URL.URL_GET_SERVICE_LIST, {})
        .then((data) => {
          console.log("data", data);
          setCurrentServiceList(data.data.services);
          createServiceNodes(data.data.services);
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    getAllService();
  }, []);

  console.log("serviceNodes", serviceNodes);

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
      <Stage
        width={900}
        height={600}
        className="border-[1px] border-[black] w-[100%] h-[100%]"
      >
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
          {/* <Circle x={100} y={200} radius={20} fill="green" />
          <Circle
            x={200}
            y={200}
            radius={20}
            fill="red"
            draggable={true}
            onDragMove={(e) => {
              changeListPosition((prev) => {
                return prev.map((val) => {
                  if (val.value === 2) {
                    val.x = e.target.x();
                    val.y = e.target.y();
                  }
                  return val;
                });
              });
            }}
          />
          <Arrow
            points={[
              listPosition[0].x,
              listPosition[0].y,
              listPosition[1].x,
              listPosition[1].y,
            ]}
            stroke="black"
            fill="black"
          /> */}
          {/* <Text text="Some text on canvas" fontSize={15} draggable={true} />
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            draggable={true}
          />
          <Circle x={200} y={100} radius={50} fill="green" draggable={true} />
          <Line
            x={20}
            y={200}
            points={[0, 0, 100, 0, 100, 100]}
            tension={0.5}
            closed
            stroke="black"
            fill="red"
            draggable={true}
          />
          <Arrow
            points={[0, 100, 100, 100]}
            stroke="black"
            fill="black"
            draggable={true}
          /> */}
        </Layer>
      </Stage>
    </div>
  );
}
