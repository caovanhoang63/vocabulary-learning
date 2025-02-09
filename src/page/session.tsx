import {useParams} from "react-router-dom";
import {Fragment, useEffect, useState} from "react";

interface vocabulary {
    word: string;
    type: string;
    meaning: string;
    image?: image;
}

interface image {
    width: number;
    height: number;
    src: string;
    alt: string;
}

interface result {
    done: boolean;
    success: boolean;
    type: number;
}

const shuffle = (array: vocabulary[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
export default function Session() {
    const {sessionName} = useParams()
    const [vocabularies, setVocabularies] = useState<vocabulary[]>([])
    const [results, setResults] = useState<result[]>([])
    const [answer, setAnswer] = useState<string>("")
    const [currentQuestion, setCurrentQuestion] = useState<number>(0)
    const [successAnswer, setSuccessAnswer] = useState<number>(0)
    useEffect(() => {
        fetch(`/${sessionName}.json`).then((res) => res.json().then(
            r => {
                setVocabularies(shuffle(r.vocabulary))
                setResults(new Array(r.vocabulary.length).fill(null).map(() => ({
                    done: false,
                    success: false,
                    type: Math.random() < 0.5 ? 0 : 1,
                })))
            }
        ))
    }, [sessionName]);
    return (
        <Fragment>
            <div className={`px-10`}>
                <div className={"my-10 flex justify-between text-2xl font-bold uppercase"}>
                    <h2 className={""}>{sessionName}</h2>
                    <div className={"flex gap-10"}>
                        <div className={"flex"}>
                            <p>{successAnswer}</p>
                            <img width={"30px"} src="/star.png" alt="star"/>
                        </div>
                        <h2>{currentQuestion + 1}/{vocabularies.length}</h2>
                    </div>
                </div>
                <div>
                    <div className="carousel w-full">
                        {
                            vocabularies.map((vocabulary, i) => (
                                <div id={i.toString()} className="carousel-item w-full">
                                    <label className="swap swap-flip text-9xl w-full">
                                        <input type="checkbox" disabled checked={results[i].done}/>
                                        <div className={"swap-on"}>
                                            <div
                                                className={`card w-[80rem] h-[35rem] m-10 shadow-xl ${results[i].success ? "bg-success" : "bg-red-400"}`}>
                                                <div className="card-body">
                                                    <h2 className="card-title text-2xl">{vocabulary.word}</h2>
                                                    <p className={"text-xl"}>
                                                        ({vocabulary.type})
                                                        <br/>
                                                        {vocabulary.meaning}
                                                    </p>
                                                    <div className="card-actions justify-end">
                                                        <button className="btn btn-primary"
                                                                onClick={() => {
                                                                    setCurrentQuestion(i + 1)
                                                                }}>
                                                            <a href={`#${(i + 1).toString()}`}>
                                                                Next
                                                            </a>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swap-off">
                                            <div className="card w-[80rem] h-[35rem] m-10 shadow-xl">
                                                <div className="card-body">
                                                    <h2 className="card-title">What is this word?</h2>
                                                    <div className={"flex"}>
                                                        <p className={"text-xl"}>{results[i].type == 0 ? vocabulary.meaning : vocabulary.word}</p>
                                                        <img src={vocabulary.image?.src}
                                                             alt={vocabulary.image?.alt}
                                                             className="rounded-xl h-80"/>
                                                    </div>
                                                    <p></p>
                                                    <div className="card-actions justify-end">
                                                        <input type="text" placeholder="Type here"
                                                               onChange={e => {
                                                                   setAnswer(e.target.value)
                                                               }}
                                                               className="input input-ghost w-full text-2xl "/>
                                                        <button className="btn btn-primary"
                                                                disabled={results[i].done}
                                                                onClick={() => {
                                                                    let success = false;
                                                                    if (results[i].type == 0) {
                                                                        success = vocabulary.word.toLowerCase() == answer.toLowerCase();
                                                                    } else {
                                                                        success = vocabulary.meaning.toLowerCase() == answer.toLowerCase();
                                                                    }
                                                                    if (success) {
                                                                        setSuccessAnswer(successAnswer + 1)
                                                                        playSound("/success.mp3")
                                                                    } else {
                                                                        playSound("/wrong.mp3")
                                                                    }
                                                                    setResults(
                                                                        results.map((r, index) => {
                                                                            if (i === index) {
                                                                                r.done = true;
                                                                                r.success = success;
                                                                            }
                                                                            return r
                                                                        })
                                                                    )
                                                                }}>Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                    {/*<div className="flex w-full justify-center gap-2 py-2">*/}
                    {/*    {*/}
                    {/*        vocabularies.map((vocabulary, i) => (*/}
                    {/*            <a href={`#${i.toString()}`} className="btn btn-xs">{i}</a>*/}
                    {/*        ))*/}
                    {/*    }*/}
                    {/*</div>*/}
                </div>
            </div>
        </Fragment>
    )
}

const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err));
};