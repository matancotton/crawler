import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Url = ({ url }) => {
    const [data, setData] = useState(JSON.parse(url.data));
    const [isVisible, setIsvisible] = useState(false);

    return (
        <div>
            <div style={{ cursor: "pointer" }}>
                href:{" "}
                <a href={data.href} target="_blank">
                    {data.href}
                </a>
            </div>
            <ul>
                <li>title: {data.title}</li>
                <li>depth: {url.depth + 1}</li>
                <li>
                    Links:
                    {data.links.map((link, i) =>
                        !!url.children[i]?.data ? (
                            <Url url={url.children[i]} key={i} />
                        ) : (
                            <div key={i}>
                                href:
                                <a href={link} target="_blank">
                                    {link}
                                </a>
                            </div>
                        )
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Url;
