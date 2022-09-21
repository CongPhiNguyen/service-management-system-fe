import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';
import './custom-tree.css';
import { useCenteredTree } from "./helper";
// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const orgChart = {
    name: 'CEO',
    children: [
        {
            name: 'Manager',
            attributes: {
                department: 'Production',
            },
            children: [
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Fabrication',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Assembly',
                    },
                    children: [
                        {
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};
const containerStyles = {
    width: "100vw",
    height: "100vh"
};

const straightPathFunc = (linkDatum, orientation) => {
    const { source, target } = linkDatum;
    return orientation === 'horizontal'
        ? `M${source.y},${source.x}L${target.y},${target.x}`
        : `M${source.x},${source.y}L${target.x},${target.y}`;
};

export default function OrgChartTree() {
    const [tree, setTree] = useState(null)
    const [dimensions, translate, containerRef] = useCenteredTree();
    useEffect(() => {
        axios.get("http://localhost:5050/api/v1/service/get-tree/632a93de2924f07fc8924697")
            .then(res => {
                console.log(res.data)
                setTree(res.data.tree)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    return (
        // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
        <div id="treeWrapper" ref={containerRef} style={{ width: '100vw', height: '100vh', background: "linear-gradient(0deg,#6a82fb,#fc5c7d)" }}>
            <Tree
                data={tree ? tree : orgChart}
                orientation={"vertical"}
                translate={{ x: 700, y: 100 }}
                transitionDuration={500}
                enableLegacyTransitions={true}
                zoomable={true}
                // CSS
                rootNodeClassName="node__root"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
                dimensions={dimensions}
                separation={{
                    nonSiblings: 2,
                    siblings: 2
                }}
            // pathFunc={straightPathFunc}
            />
        </div>
    );
}