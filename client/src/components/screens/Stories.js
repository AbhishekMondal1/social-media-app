import React from "react";
import {Link} from 'react-router-dom'
//import HorizontalScroll from "react-scroll-horizontal";

const Stories = () => {
    const [state, setState] = React.useState([
        { id: 1, image: "/images/abc.jpg", name:"rohan1414" },
        { id: 2, image: "/images/nature.jpg", name: "suraj24" },
        { id: 3, image: "/images/dhoni.jfif", name: "aditya01" },
        { id: 4, image: "/images/virat.jfif", name: "abhishek2" },
        { id: 5, image: "/images/hrithik.jfif", name: "raj157" },
        { id: 6, image: "/images/fun.jfif", name: "rohan_raj" },
    ]);

    return (
    <div className="stories"
    style={{ maxWidth: "500px", margin: "26px auto"}}>

        {state.map((user) => (
            <div className="stories_info" key={user.id}>
                <div className="stories_img">
                    <span>
                        <img src={user.image} alt="user" />
                    </span>
                </div>
                <div className="stories_name">{user.name}</div>
            </div>
        ))}
        </div>
    );
        };

        export default Stories;