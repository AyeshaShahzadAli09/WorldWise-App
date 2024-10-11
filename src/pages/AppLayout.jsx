import Sidebar from "../components/SideBar"
import styles from "../pages/AppLayout.module.css"
import Map from "../components/Map"
import User from "../components/User"
const AppLayout = () =>{
    return(
        <div className={styles.app}>
            <Sidebar/>
            <Map/>
             <User/>
        </div>
    )
}

export default AppLayout;