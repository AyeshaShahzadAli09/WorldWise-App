import { Link } from "react-router-dom";
import styles from "../components/Logo.module.css"

const Logo = ()=>{
    return(
        <Link to='/'>
        <img src="./logo.png" alt="WorldWise Logo" className={styles.logo} />
        </Link>
    )
}
export default Logo;