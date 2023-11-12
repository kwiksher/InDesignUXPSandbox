import React from "react";

import { WC } from "./WC.jsx";

import "./Home.css";

import {showAlert} from "../commands/showAlert.js"

export const Home = () => {

    function handleCreate() {
      // alert('create');
      showAlert();
    }
    function handleCancel() {
      alert('cancel');
    }

    return (
        <div>
                <WC>
                    <input/>
                    <button onClick={handleCreate}>Create</button>
                    <button onClick={handleCancel}>Cancel</button>
                </WC>
                <p className="display">Create Rect and Image layers from Figma Json </p>
       </div>
    );
}
