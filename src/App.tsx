import Router from "./router.tsx";
import {ToastContainer} from "react-toastify";
import {Fragment} from "react";

function App() {
    return (
        <Fragment>
            <Router/>
            <ToastContainer position="bottom-right"/>
        </Fragment>
    )
}

export default App
