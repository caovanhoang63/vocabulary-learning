import {Link, useParams} from "react-router-dom";
import {Fragment, useEffect, useRef, useState} from "react";
import {toast} from "react-toastify";

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
    const [done, setDone] = useState<boolean>(false)
    const [vocabularies, setVocabularies] = useState<vocabulary[]>([])
    const [results, setResults] = useState<result[]>([])
    const [answer, setAnswer] = useState<string>("")
    // const [currentQuestion, setCurrentQuestion] = useState<number>(0)
    const [successAnswer, setSuccessAnswer] = useState<number>(0)
    // const [starPosition, setStarPosition] = useState<{ x: number; y: number } | null>(null);
    const scoreStar = useRef<HTMLImageElement>(null);
    const rand = Math.floor(Math.random() * 3);
    useEffect(() => {
        fetch(`/vocabulary-learning/${sessionName}.json`).then((res) => res.json().then(
            r => {
                setVocabularies(shuffle(r.vocabulary).slice(0, 20))
                setResults(new Array(20).fill(null).map(() => ({
                    done: false,
                    success: false,
                    type: Math.random() < 0.5 ? 0 : 1,
                })))
            }
        ))
    }, [sessionName]);
    return (
        <Fragment>
            <dialog id="modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="flex flex-col items-center">
                        {successAnswer > 15 && successAnswer <= 20 &&
                            <img className={"aspect-square"} width={"300px"}
                                 src={`/vocabulary-learning/goodjob${rand}.png`}
                                 alt=""/>
                        }
                        {successAnswer > 5 && successAnswer <= 15 &&
                            <img className={"aspect-square"} width={"300px"}
                                 src={`/vocabulary-learning/nor${rand}.png`} alt=""/>
                        }
                        {successAnswer <= 5 &&
                            <img className={"aspect-square"} width={"300px"}
                                 src={`/vocabulary-learning/wtf${rand}.png`} alt=""/>
                        }
                        <div className={"flex mt-4"}>
                            <img width={"50px"} src="/vocabulary-learning/star.png" alt="star" ref={scoreStar}/>
                            <p className="py-4 text-4xl">{successAnswer}/{vocabularies.length}</p>
                        </div>
                    </div>
                    <div className="modal-action">
                        <form method="dialog" className="space-x-2">
                            <button className="btn btn-primary">Review</button>
                            <Link to={"/"} className="btn">Back to home</Link>
                        </form>
                    </div>
                </div>
            </dialog>
            <div className={`px-10`}>
                <div className={"my-10 flex justify-between text-2xl font-bold uppercase"}>
                    <h2 className={""}>{sessionName}</h2>
                    <div className={"flex gap-10"}>
                        <div className={"flex"}>
                            <p>{successAnswer}</p>
                            <img width={"30px"} src="/vocabulary-learning/star.png" alt="star" ref={scoreStar}/>
                        </div>
                    </div>
                </div>
                <div className={"flex"}>
                    <div className="carousel w-full mr-10 ">
                        {
                            vocabularies.map((vocabulary, i) => (
                                <div key={i} id={i.toString()} className="carousel-item w-full ">
                                    <label className="swap swap-flip text-9xl w-full select-text">
                                        <input type="checkbox"
                                               onClick={(e) => e.preventDefault()}
                                               checked={results[i].done}
                                               onChange={() => {
                                               }}
                                               className=""
                                        />
                                        <div className={"swap-on"}>
                                            <div
                                                className={`card w-[80rem] h-[35rem] m-10 shadow-xl ${results[i].success ? "bg-success" : "bg-red-400"}`}>
                                                <div className="card-body">
                                                    <h2 className="card-title cursor-text text-2xl">{i + 1}.{vocabulary.word}</h2>
                                                    <p className={"text-xl cursor-text"}>
                                                        ({vocabulary.type})
                                                        <br/>
                                                        {vocabulary.meaning}
                                                    </p>
                                                    <div className="card-actions justify-end">
                                                        <a href={`#${(i + 1).toString()}`}
                                                           className="btn btn-primary"
                                                           onClick={() => {
                                                               // setCurrentQuestion(i + 1)
                                                               if (i + 1 == vocabularies.length) {
                                                                   setDone(true)
                                                                   if (document) {
                                                                       (document.getElementById('modal') as HTMLFormElement).showModal();
                                                                   }
                                                               }
                                                           }}>
                                                            {i + 1 == vocabularies.length ? "Done" : "Next"}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swap-off">
                                            <div className="card w-[80rem] h-[35rem] m-10 shadow-xl">
                                                <div className="card-body ">
                                                    <h2 className="card-title cursor-text">{i + 1}. What is this
                                                        word?</h2>
                                                    <div className={"flex"}>
                                                        <p className={"text-xl cursor-text "}>{results[i].type == 0 ? vocabulary.meaning : vocabulary.word}</p>
                                                        <img src={vocabulary.image?.src}
                                                             alt={vocabulary.image?.alt}
                                                             className="rounded-xl h-80"/>
                                                    </div>
                                                    <p></p>
                                                    <div className="card-actions justify-end">
                                                        <input type="text"
                                                               placeholder="Type here"
                                                               onChange={e => {
                                                                   setAnswer(e.target.value)
                                                               }}
                                                               className="input input-ghost w-full text-2xl "/>
                                                        <button className="btn btn-primary"
                                                                disabled={results[i].done || done}
                                                                onClick={() => {
                                                                    if (answer.trim() === "") {
                                                                        toast.warning("Type your answer!")
                                                                        return
                                                                    }
                                                                    let success = false;
                                                                    if (results[i].type == 0) {
                                                                        success = vocabulary.word.toLowerCase() == answer.trim().toLowerCase();
                                                                    } else {
                                                                        success = vocabulary.meaning.toLowerCase().split(",").includes(answer.trim().toLowerCase());
                                                                    }
                                                                    if (success) {
                                                                        const random = Math.floor(Math.random() * 3);
                                                                        switch (random) {
                                                                            case 0:
                                                                                toast.success("Giỏi z trời");
                                                                                break;
                                                                            case 1:
                                                                                toast.success("Đúng rồi nè")
                                                                                break;
                                                                            default:
                                                                                toast.success("Quá chuẩn")
                                                                                break;
                                                                        }
                                                                        setSuccessAnswer(successAnswer + 1)
                                                                        playSound("/vocabulary-learning/success.mp3")
                                                                    } else {
                                                                        const random = Math.floor(Math.random() * 3);
                                                                        switch (random) {
                                                                            case 0:
                                                                                toast.error("gà quá")
                                                                                break;
                                                                            case 1:
                                                                                toast.error("Cố lên")
                                                                                break;
                                                                            default:
                                                                                toast.error("Ổn hong z ba")
                                                                                break;
                                                                        }
                                                                        playSound("/vocabulary-learning/wrong.mp3")
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
                                                                    setAnswer("")
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
                    <div className={` ${done ? "" : "hidden"} `}>
                        <div className="grid grid-cols-4 gap-2 h-56">
                            {results.map((r, index) => {
                                    if (r.done && r.success) {
                                        return <a href={`#${index}`} className={"btn btn-xs bg-success"}>{index + 1}</a>

                                    } else if (r.done) {
                                        return <a href={`#${index}`} className={"btn btn-xs bg-red-400"}>{index + 1}</a>

                                    }
                                    return <a href={`#${index}`} className={"btn btn-xs"}>{index + 1}</a>
                                }
                            )}
                        </div>
                        <button className="btn btn-primary" onClick={() => {

                        }}>
                            Home
                        </button>
                    </div>

                </div>
                {/*{(starPosition && scoreStar.current) && (<motion.img*/}
                {/*    initial={{x: starPosition.x, y: starPosition.y, scale: 1, opacity: 1}}*/}
                {/*    animate={{*/}
                {/*        x: 1700,*/}
                {/*        y: -710,*/}
                {/*        scale: 1,*/}
                {/*        opacity: 0.3,*/}
                {/*    }}*/}
                {/*    width={"30px"} src="/vocabulary-learning/star.png" alt="star"*/}
                {/*    transition={{duration: 1.5, ease: "easeInOut"}}*/}
                {/*    className="absolute w-8 h-8 "*/}
                {/*>*/}
                {/*</motion.img>)}*/}
            </div>
        </Fragment>
    )
}

const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err));
};