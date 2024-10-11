import { createContext , useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();


function CitiesProvider({children})  // provider function
{
    const[cities , setCities] = useState([]) ;
    const[isLoading , setIsLoading] = useState(false); 
    const [currentCity , setCurrentCity] = useState({});

     useEffect(function(){
      async function fetchCities()
     { 
        try{
          setIsLoading(true);
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();
          // console.log(data);
          setCities(data);
        }catch{
          alert("There is an error");
        }finally{
          setIsLoading(false);
        }
     } fetchCities();
     },[]) ;

    async  function getCity(id)
     {  
         try{
           setIsLoading(true);
           const res = await fetch(`${BASE_URL}/cities/${id}`);
           const data = await res.json();
          //  console.log(data);
           setCurrentCity(data);
         }catch{
           alert("There is an error");
         }finally{
           setIsLoading(false);
         }
     }

     async function createCity(newCity)
     {  
         try{
           setIsLoading(true);
           const res = await fetch(`${BASE_URL}/cities` ,
            { method : 'POST' ,
              body : JSON.stringify(newCity),
              headers: {"Content-Type": "application/json"}
          // this all above in url is not about react , its all the standard for a post request to an api (to send data to api)
           });
           const data = await res.json();
          //  console.log(data);
           setCities((cities)=>[...cities,data]);
         }catch{
           alert("There is an error");
         }finally{
           setIsLoading(false);
         }
     }

     
     async function deleteCity(deleteId)
     {  
         try{
          setIsLoading(true);
         await fetch(`${BASE_URL}/cities/${deleteId}` ,
           { method : "DELETE" ,
          });
           
           setCities((cities)=> cities.filter((city)=> city.id !== deleteId ));
         }catch{
           alert("There is an error in deleting city");
         }finally{
           setIsLoading(false);
         }
     }

     return <CitiesContext.Provider value={{cities , isLoading  , currentCity ,getCity , createCity , deleteCity}}> 
        {children}
     </CitiesContext.Provider>
}

function useCities()
{
    const context = useContext(CitiesContext)
    if(context === undefined) throw new Error("Cities context is used outside the citiesProvider");
    return context;
}


export {CitiesProvider ,useCities};