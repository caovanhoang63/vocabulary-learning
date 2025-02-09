import {Fragment, useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function Dashboard() {
    const [sessions, setSessions] = useState<string[]>([])
    useEffect(() => {
        fetch("/vocabulary-learning/sessions.json")
            .then((res) => {
                res.json().then(
                    r => setSessions(r.sessions),
                )
            })
    }, []);
    return (
        <Fragment>
            <div className={"px-10"}>
                <h2 className={"text-2xl py-5 font-bold"}>Chose a session</h2>
                <div className={"grid grid-cols-4 gap-20"}>
                    {
                        sessions.map(session => (
                            <Link to={`/session/${session}`}>
                                <div className={`card bg-base-100 w-96 shadow-xl
                                            hover:opacity-50 hover:cursor-pointer`}>
                                    <figure>
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                            alt="Shoes"/>
                                    </figure>
                                    <div className="card-body">
                                        <h2 className="card-title">{session.toUpperCase()}</h2>
                                    </div>
                                </div>
                            </Link>

                        ))
                    }
                </div>
            </div>
        </Fragment>
    )
}