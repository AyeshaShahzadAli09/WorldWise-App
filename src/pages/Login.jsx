import PageNav from "../components/PageNav";
// import Button
import styles from "../pages/Login.module.css"
import { useAuth } from "../contexts/FakeAuthContent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
const Login = ()=>{
    const {login , isAuthenticated} = useAuth();
    const navigate = useNavigate();

    // function handleLogin(e)
    // {
    //     e.preventDefault();
    //     login(email,password);
    // }
    const[email , setEmail] = useState("jack@example.com");
    const[password , setPassword] = useState("qwerty");

    function handleSubmit(e)
    {
        e.preventDefault();
        console.log("sumit");
        if(email && password) login(email,password);
    }

    useEffect(function(){
        if(isAuthenticated === true)
            navigate("/app" , {replace:true});
    },[isAuthenticated , navigate])

    return(
        <main>
             <PageNav/>
        <section className={styles.login}>
            <form className={styles.form}>
                <div className={styles.row}>
                    <label htmlFor="email">Email Address</label>
                    <input type="email"id="email"  onChange={(e) => setEmail(e.target.value)}value={email}/>
                    {/* <input type="email" id="email" value=""></input> */}
                </div>

                <div className={styles.row}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>

                <div>
          {/* <Button type="primary" onClick={handleLogin}>Login</Button> */}
          <Button type="primary" onClick={handleSubmit}>Login</Button>
        </div>
            </form>
        </section>
        </main>
    )
}
export default Login;