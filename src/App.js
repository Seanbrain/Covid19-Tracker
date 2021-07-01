
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table'
import {sortData} from './util';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([])
   // TO KEEP TRACK OF COUNTRY SELECTED ON THE SITE
   const [country, setCountry] = useState('worldwide')

   const[countryInfo, setCountryInfo] = useState({})

   const [tableData, setTableData] = useState([])

   const [mapCenter, setMapCenter] = useState({lat:34.80746, lng: -40.4796})

   const [mapZoom, setMapZoom] = useState(3)

   const [mapCountries, setMapCountries] =useState([])

    useEffect(() => {
      fetch( "https://disease.sh/v3/covid-19/all"
      )
    .then(response => response.json())
    .then(data => {
     //All the data from the country response
      setCountryInfo(data);
    })         
    }, [])

    

  useEffect(() => {
    //an async fuction is going to run here. It is called async because
    //it basically sends a rewuest to a server, waits for it and 
    //do something with it.
    const getCountriesData = async () => {
      await fetch( "https://disease.sh/v3/covid-19/countries")
        
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2 //USA, UK, FR, 
          }));
          const sortedData = sortData(data)
          setTableData(sortedData);
          setMapCountries(data)
          setCountries(countries)
        })
    }
        getCountriesData();

  }, [])
  const onCountryChange =  async (event) => {
    const countryCode = event.target.value
    // setCountry(countryCode)

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'
    :  `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      //All the data from the country response
      setCountryInfo(data);

      setMapCenter(data.countryInfo.map, data.countryInfo.lng)
      setMapZoom(4);
    })
  };

  return (
    <div className="app"> {/*BEM NAMING CONVENTION*/}
    <div className="left">
    <div className="app__header">     

<h1>COVID-19 TRACKER </h1>
<FormControl className ="app__dropdown">
  <Select
  variant ="outlined"
  onChange={onCountryChange} // An event listener that listens when a country is selected in the 
  //drop down menu and then proceeds to take an action by calling the function {onCountryChange}
  value={country}   
  >
    <MenuItem value="worldwide">Worldwide</MenuItem>
    {/*Loop through all the countries and show a drop down list of the options. We use useState as a short term memory for this function*/}
      {
        countries.map((country) => (
          <MenuItem value={country.value}
          >{country.name}</MenuItem>

        ))

      }
    {/* <MenuItem value="worldwide">Worldwide</MenuItem>
    <MenuItem value="worldwide">Option2</MenuItem>
    <MenuItem value="worldwide">Option3</MenuItem>
    <MenuItem value="worldwide">Option4</MenuItem> */}

  </Select>

</FormControl>

</div>


{/*Header*/}
{/*Title + Select input drop down Field*/}
<div className="app__stats">
   {/*Info Boxs title= Coronavirus cases....note that props allows one component to be different from another*/} 
   <InfoBox title = "Coronavirus cases" cases ={countryInfo.todayCases} total={countryInfo.cases}/>
  {/*Info Boxs title = Coronavirus recovered*/}
  <InfoBox title="Recovered" cases ={countryInfo.todayRecovered} total={countryInfo.recovered}/>
  {/*Info Boxs title = Coronavirus deaths */}
  <InfoBox title=" Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />

</div>





{/*Map*/}
<Map 
center={mapCenter}
zoom={mapZoom}
countries={mapCountries}/>
      
 </div>
 <Card className="app__right">
   <CardContent>
   <h3> Live Cases By Country</h3>

      {/*Table*/}
      <Table countries ={tableData} />
     
      <h3> Worldwide New Cases</h3>
      {/*Graph*/}
      <LineGraph />
      </CardContent>

 </Card>
    
    
    </div>
  );
}

export default App;
