import {Header} from "../components/Header.jsx"
import './NotFound.css'

export function NotFound({cart}){



    return(
        <>
        
    <Header cart={cart} />

    <div className="not-found-message">page not found</div>
    </>
    );
}