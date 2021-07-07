import React from "react";
import axios from "axios";

const Form = ({ setTreeName }) => {
    const onSubmitForm = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:4000/", {
                startUrl: e.target.children[0].value,
                depth: e.target.children[1].value,
                max: e.target.children[2].value,
            })
            .then(({ data }) => {
                setTreeName(e.target.children[0].value.split('.')[1]);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };
    return (
        <form onSubmit={onSubmitForm}>
            <input type="text" placeholder="start url" />
            <input type="number" placeholder="max depth" />
            <input type="number" placeholder="max total pages" />
            <button>SUBMIT</button>
        </form>
    );
};

export default Form;
