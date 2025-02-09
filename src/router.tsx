import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./page/dashboard.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import Session from "./page/session.tsx";

export default function Router () {

    return(
        <BrowserRouter>
            <Routes >
                <Route path="/" element={<MainLayout/>}>
                    <Route index element={<Dashboard/>}/>
                    <Route path={"session/:sessionName"} element={<Session/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )

}