import { createContext, useEffect, useContext, useReducer, useCallback } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

const initialState  = {
  cities: [],
  isLoading : false,
  currentCity: {},
  error:""
}
function reducer(state,action){ //  reducers need to be pure functions so that fake api request cant be done in reducer function , so fetch request can be done in separate functions 
  switch(action.type)
  {
    case 'loading':
      return {...state , isLoading:true}

    case 'cities/loaded':
      return{
        ...state,
        isLoading:false,
        cities : action.payload,
      }
      case 'city/loaded':
        return{
          ...state, isLoading:false , currentCity: action.payload
        }
    case 'city/created':
      return {
        ...state,
        isLoading:false,
        cities:[...state.cities , action.payload],
        currentCity:action.payload
      }
    case 'city/deleted':
      return{
        ...state,
        isLoading:false,
        cities: state.cities.filter((city)=> city.id !== action.payload),
        currentCity:{}
      }  
    case 'rejected':
      return {...state , isLoading:false , error : action.payload}
    default:
      throw new Error ("Unknown Error Type");
  } 
}

function CitiesProvider({children})  // provider function
{
  const [{ cities , isLoading, currentCity , error}, dispatch] = useReducer(reducer , initialState);
    // const[cities , setCities] = useState([]) ;
    // const[isLoading , setIsLoading] = useState(false); 
    // const [currentCity , setCurrentCity] = useState({});
     useEffect(function(){
      async function fetchCities()
     { 
      dispatch({type:"loading"});
        try{
          // setIsLoading(true);
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();
          dispatch({type:"cities/loaded" , payload:data})
          // console.log(data);
          // setCities(data);
        }catch{
          // alert("There is an error");
          dispatch({type:'rejected' , payload: "There is an error"})
        }
     } fetchCities();
     },[]) ;

    const getCity = useCallback(async  function getCity(id)
     {  
      if(Number(id) === currentCity.id) return;
      dispatch({type:"loading"});
         try{
          //  setIsLoading(true);
           const res = await fetch(`${BASE_URL}/cities/${id}`);
           const data = await res.json();
           dispatch({type:'city/loaded' , payload : data})
          //  console.log(data);
          //  setCurrentCity(data);
         }catch{
          //  alert("There is an error");
          dispatch({type:'rejected' , payload: "There is an error in loading a city"})
         }
     },
     [currentCity.id]);

     async function createCity(newCity)
     {  
      dispatch({type:"loading"});
         try{
          //  setIsLoading(true);
           const res = await fetch(`${BASE_URL}/cities` ,
            { method : 'POST' ,
              body : JSON.stringify(newCity),
              headers: {"Content-Type": "application/json"}
          // this all above in url is not about react , its all the standard for a post request to an api (to send data to api)
           });
           const data = await res.json();
          //  console.log(data);
          //  setCities((cities)=>[...cities,data]);
          dispatch({type: 'city/created' , payload : data})
         }catch{
          //  alert("There is an error");
          dispatch({type:'rejected' , payload: "There is an error in creating a city"})
         }
     }

     
     async function deleteCity(deleteId)
     {  
      dispatch({type:"loading"});
         try{
          // setIsLoading(true);
         await fetch(`${BASE_URL}/cities/${deleteId}` ,
           { method : "DELETE" ,
          });
           dispatch({type:'city/deleted' , payload:deleteId})
          //  setCities((cities)=> cities.filter((city)=> city.id !== deleteId ));
         }catch{
          dispatch({type:'rejected' , payload: "There is an error in deleting a city"})
         }
     }

     return <CitiesContext.Provider value={{cities , isLoading  , currentCity ,getCity , createCity , deleteCity , error}}> 
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