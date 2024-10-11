// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useCities} from  "../contexts/CitiesContext"

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {
  const {createCity , isLoading} = useCities();
  const [lat, lng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji , setEmoji] = useState("");
  const[geoCodingError, setGeoCodingError] = useState("");
  
  const navigate = useNavigate();

  const[isLoadingGeoCoding , setIsLoadingGeoCoding] = useState(false); //isloading


  useEffect(function()
  {
    if(!lat && !lng) return;

  async function fetchCityData(){
  try{
    setIsLoadingGeoCoding(true);
    setGeoCodingError(""); //to reset the error
    const response = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
    const data = await response.json();
    if(!data.countryCode) throw new Error("That doesn't seem to be a country.Click somewhere else");
    // console.log(data);
    setCityName(data.city || data.locality || "");
    setCountry(data.countryName);
    setEmoji(convertToEmoji(data.countryCode));
  }
  catch(err){
        console.log(err);
    setGeoCodingError(err.message);
  }
  finally{
    setIsLoadingGeoCoding(false);
  }
}
fetchCityData();
},[lat,lng])

  async function handleSubmit(e)
  {
    e.preventDefault();
    if(!cityName || !date)  return;

    const newCity = {  //same format as in cities.json ,except "id" is auto craeted by json-server(fake api)
      cityName,
      country,
      emoji,
      date,
      notes,
      position :  {lat , lng},
    }
    // console.log(newCity);
    await createCity(newCity); // as createCity is an async function(in "citiesContext.jsx") which returns a promise so it can await , so also make this handle function "async"
    navigate('/app/cities');
  }

if(isLoadingGeoCoding) return <Spinner/>
if(!lat && !lng) return <Message message="Start by clicking somewhere on the map"/>
if(geoCodingError) return <Message message={geoCodingError}/>


  return (
    <form className={`${styles.form} ${isLoading ? 'styles.loading' : " "}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>  {/*in react 'for' is called 'htmlFor' prop */}
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker  id="date" onChange={(date) => setDate(date)} selected={date} dateFormat='dd/MM/yyyy'/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton>&larr; Back</BackButton>
      </div>
    </form>
  );
}

export default Form;