import React, { useEffect, useState } from "react";
import axios from "axios";
import Url from "./Url";
import { nanoid } from "nanoid";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { dividerClasses } from "@mui/material";

const DisplayJobs = ({ treeName }) => {
    const [urlDetails, setUrlDetails] = useState(null);

    const renderTree = (nodes) => {
        const data = JSON.parse(nodes.data || {});
        nodes.children = nodes.children.filter((node) => node != null);
        return (
            <TreeItem key={nanoid()} nodeId={nanoid()} label={data.title}>
                <TreeItem nodeId={nanoid()} label={"link: " + data.href} />
                <TreeItem nodeId={nanoid()} label={"depth: " + nodes.depth} />
                <TreeItem nodeId={nanoid()} label="links:">
                    {nodes.children.length > 0
                        ? nodes.children.map((node, i) => {
                              if (node.data != null) return renderTree(node);
                              return (
                                  <TreeItem
                                      key={nanoid()}
                                      nodeId={nanoid()}
                                      label={data.links[i]}
                                  />
                              );
                          })
                        : data.links.map((link) => (
                              <TreeItem
                                  key={nanoid()}
                                  nodeId={nanoid()}
                                  label={link}
                              />
                          ))}
                </TreeItem>
            </TreeItem>
        );
    };

    useEffect(() => {
        if (!!treeName) {
            const serverUrl = "http://localhost:4000/get-data/";

            const interval = setInterval(() => {
                axios
                    .get(serverUrl)
                    .then(({ data }) => {
                        // const result = [];
                        // data.forEach((element) => {
                        //     result.push(JSON.parse(element));
                        // });
                        // setUrlDetails(result);
                        console.log(data.isDone);
                        setUrlDetails(data.value.root);
                        if (data.isDone) clearInterval(interval);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }, 1000);
        }
    }, [treeName]);
    // return (
    //     <div>
    //         {!!urlDetails ? (
    //             <Url url={urlDetails} key={nanoid()} />
    //         ) : (
    //             <div></div>
    //         )}
    //     </div>
    // );

    return (
        <div style={{ marginTop: "4rem" }}>
            {!!urlDetails && (
                <TreeView
                    aria-label="rich object"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpanded={["root"]}
                    defaultExpandIcon={<ChevronRightIcon />}
                    // sx={{
                    //     height: 110,
                    //     flexGrow: 1,
                    //     maxWidth: 400,
                    //     overflowY: "auto",
                    // }}
                >
                    {renderTree(urlDetails)}
                </TreeView>
            )}
        </div>
    );
};

export default DisplayJobs;
