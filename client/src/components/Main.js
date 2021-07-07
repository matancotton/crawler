import React, { useState } from "react";
import DisplayJobs from "./DisplayJobs";
import Form from "./Form";

const Main = () => {
    const [treeName, setTreeName] = useState(undefined);

    return (
        <div>
            <Form setTreeName={setTreeName} />
            <DisplayJobs treeName={treeName} />
        </div>
    );
};

export default Main;
