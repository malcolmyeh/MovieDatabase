import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    
    return (
        <div>
            <h1>HOME</h1>
            <Link to="/movie"><h3>Sample Movie Page</h3></Link>
            <Link to="/profile/someone"><h3>Sample Other User Page</h3></Link>
            <Link to="/person"><h3>Sample Person Page</h3></Link>

            <h3>- most recent movies</h3>
            <h3>- most popular (by # of imbd votes)</h3>
            <h3>- recent reviews (user review from this site)</h3>
            <h3>- feed (followed person new movie, followed user review)</h3>
        </div>
    )
}