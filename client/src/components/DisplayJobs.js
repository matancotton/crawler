import React, { useEffect, useState } from "react";
import axios from "axios";
import Url from "./Url";
import { nanoid } from "nanoid";

const DisplayJobs = ({ treeName }) => {
    const [urlDetails, setUrlDetails] = useState(null);

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
                        // console.log(data.value.root);
                        setUrlDetails(data.value.root);
                        if (data.isDone) clearInterval(interval);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }, 1000);
        }
    }, [treeName]);
    return (
        <div>
            {!!urlDetails ? (
                <Url url={urlDetails} key={nanoid()} />
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default DisplayJobs;
