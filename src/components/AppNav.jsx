import { NavLink } from "react-router-dom";
import styles from "../components/AppNav.module.css"
// import AppNav from "./PageNav";

const AppNav = () =>{
    return(
        <nav className={styles.nav}>
        <ul>
            <li>
                <NavLink to='cities'>Cities</NavLink>
            </li>
            <li>
                <NavLink to='countries'>Countres</NavLink>
            </li>
        </ul>
        </nav>
    )
}

export default AppNav;