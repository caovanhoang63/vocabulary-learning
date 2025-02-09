import {useParams} from "react-router-dom";
import {Fragment, useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
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
    const [vocabularies, setVocabularies] = useState<vocabulary[]>([])
    const [results, setResults] = useState<result[]>([])
    const [answer, setAnswer] = useState<string>("")
    const [currentQuestion, setCurrentQuestion] = useState<number>(0)
    const [successAnswer, setSuccessAnswer] = useState<number>(0)
    const [starPosition, setStarPosition] = useState<{ x: number; y: number } | null>(null);
    const scoreStar = useRef<HTMLImageElement>(null);
    useEffect(() => {
        fetch(`/vocabulary-learning/${sessionName}.json`).then((res) => res.json().then(
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
                            <img width={"30px"} src="/vocabulary-learning/star.png" alt="star" ref={scoreStar}/>
                        </div>
                        <h2>{currentQuestion + 1}/{vocabularies.length}</h2>
                    </div>
                </div>
                <div>
                    <div className="carousel w-full">
                        {
                            vocabularies.map((vocabulary, i) => (
                                <div id={i.toString()} className="carousel-item w-full ">
                                    <label className="swap swap-flip text-9xl w-full select-text ">
                                        <input type="checkbox"
                                               onClick={(e) => e.preventDefault()}
                                               checked={results[i].done}
                                               className=""
                                        />
                                        <div className={"swap-on "}>
                                            <div
                                                className={`card w-[80rem] h-[35rem] m-10 shadow-xl ${results[i].success ? "bg-success" : "bg-red-400"}`}>
                                                <div className="card-body">
                                                    <h2 className="card-title cursor-text text-2xl">{vocabulary.word}</h2>
                                                    <p className={"text-xl cursor-text"}>
                                                        ({vocabulary.type})
                                                        <br/>
                                                        {vocabulary.meaning}
                                                    </p>
                                                    <div className="card-actions justify-end">
                                                        <a href={`#${(i + 1).toString()}`}
                                                           className="btn btn-primary"
                                                           onClick={() => {
                                                               setCurrentQuestion(i + 1)
                                                           }}>
                                                            Next
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swap-off">
                                            <div className="card w-[80rem] h-[35rem] m-10 shadow-xl">
                                                <div className="card-body ">
                                                    <h2 className="card-title cursor-text">What is this word?</h2>
                                                    <div className={"flex"}>
                                                        <p className={"text-xl cursor-text "}>{results[i].type == 0 ? vocabulary.meaning : vocabulary.word}</p>
                                                        <img src={vocabulary.image?.src}
                                                             alt={vocabulary.image?.alt}
                                                             className="rounded-xl h-80"/>
                                                    </div>
                                                    <p></p>
                                                    <div className="card-actions justify-end">
                                                        <input autoFocus={true} type="text" placeholder="Type here"
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
                                                                        toast.success("Giỏi z trời");
                                                                        setSuccessAnswer(successAnswer + 1)
                                                                        playSound("/vocabulary-learning/success.mp3")
                                                                        setStarPosition({
                                                                            x: 1500,
                                                                            y: -200,
                                                                        });
                                                                        setTimeout(() => {
                                                                            setStarPosition(null);
                                                                        }, 1500);
                                                                    } else {
                                                                        toast.error("Thu Hà gà quá")
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
                {(starPosition && scoreStar.current) && (<motion.img
                    initial={{x: starPosition.x, y: starPosition.y, scale: 1, opacity: 1}}
                    animate={{
                        x: 1700,
                        y: -710,
                        scale: 1,
                        opacity: 0.3,
                    }}
                    width={"30px"} src="/vocabulary-learning/star.png" alt="star"
                    transition={{duration: 1.5, ease: "easeInOut"}}
                    className="absolute w-8 h-8 "
                >
                </motion.img>)}
            </div>

        </Fragment>
    )
}

const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch((err) => console.error("Lỗi phát âm thanh:", err));
};