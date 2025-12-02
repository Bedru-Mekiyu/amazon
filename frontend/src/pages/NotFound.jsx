import {Header} from "../Components/Header.jsx"
import './NotFound.css'

export function NotFound({cart}){



    return(
        <>
        
    <Header cart={cart} />

    <div className="not-found-message">page not found</div>
    </>
    );
}