import React from 'react'
import Tree from 'react-d3-tree';
import "./custom-tree.css"
import { useState } from 'react';
import { v4 } from "uuid";
const orgChart = {
    name: 'CEO',
    attributes: {
        id: "CEO"
    },
    children: [
        {
            name: 'Manager',
            attributes: {
                department: 'Production',
                id: "123"
            },
            children: [
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Fabrication',
                        id: "567"
                    },
                    children: [
                        {
                            attributes: {
                                department: 'Fabrication',
                                id: "gggg"
                            },
                            name: 'Worker',
                        },
                        {
                            attributes: {
                                department: 'Fabrication',
                                id: "fsdas"
                            },
                            name: 'Worker',
                            children: [
                                {
                                    attributes: {
                                        department: 'Fabrication',
                                        id: "423"
                                    },
                                    name: 'Worker',
                                },
                                {
                                    attributes: {
                                        id: "kk"
                                    },
                                    name: 'Worker',
                                },
                            ]
                        },
                    ],
                },
                {
                    name: 'Foreman',
                    attributes: {
                        department: 'Assembly',
                        id: "562227"
                    },
                    children: [
                        {
                            attributes: {
                                department: 'Assembly',
                                id: "hẻgwerg"
                            },
                            name: 'Worker',
                        },
                    ],
                },
            ],
        },
    ],
};

export default function D3js() {
    const [tree, setTree] = useState(orgChart)

    const handleNodeClick = data => {
        console.log(data);

    }

    return (
        <div id="treeWrapper" className='mt-[50px] ml-[50px]' style={{ width: '100em', height: '50em', border: '1px solid black' }}>
            <Tree
                data={tree}
                rootNodeClassName="node__root"
                branchNodeClassName="node__branch"
                leafNodeClassName="node__leaf"
                orientation='vertical'
                zoomable={true}
                zoom={0.5}
                translate={{ x: 300, y: 100 }}
                onNodeClick={handleNodeClick}
            />
        </div>
    )
}