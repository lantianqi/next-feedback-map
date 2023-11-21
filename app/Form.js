'use client'

import React, { useState, useEffect } from "react";
import { useFormStatus } from 'react-dom';


function Form() {
  const [userLocation, setUserLocation] = useState(null);
  const [userLatitude, setUserLatitude] = useState("");
  const [userLongitude, setUserLongitude] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userRegion, setUserRegion] = useState("");

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false); 

  useEffect(() => {
    validateForm();
  }, [userDisplayName, userMessage, userLocation])

  const validateForm = () => {
    let errors = {};

    if (!userDisplayName) {
      errors.userDisplayName = 'Name is required.';
    }
    if (!userMessage) {
      errors.userMessage = 'Message is required.';
    }
    if (!userLocation) {
      errors.userLocation = 'Your Location is required.\nClick Get button to get your location!';
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  }

  // const [formData, setFormData] = useState({
  //   userDisplayName: "",
  //   userMessage: "",
  //   userLocation: null,
  //   userLatitude: "",
  //   userLongitude: "",
  //   userCity: "",
  //   userRegion: ""
  // });

  const getUserCityRegion = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Make a request to a Geocoding API (e.g. Google Maps Geocoding API)
    const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    console.log(process.env);
    console.log(GOOGLE_MAP_API_KEY);
    const geocoding_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}&region=AU&language=en`;

    fetch(geocoding_url)
      .then((response) => response.json())
      .then((data) => {
        // Parse the city name from the API response
        const city = data.results[0].address_components.find((component) =>
          component.types.includes("locality")
        ).long_name;
        const region = data.results[0].address_components.find((component) =>
          component.types.includes("country")
        ).long_name;

        console.log(`Your city is ${city}.`);
        console.log(`Your region is ${region}.`);

        setUserCity(city);
        setUserRegion(region);
      })
      .catch((error) => console.log(error));
  }

  /**
   * 
   * @returns GetGeo Component button
   */
  function GetGeo() {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        // geolocation is supported
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // we have the position
            // success callback
            console.log(position);
            const { latitude, longitude } = position.coords;
            setUserLocation(position);
            setUserLatitude(latitude);
            setUserLongitude(longitude);
            getUserCityRegion(position);
          },
          (error) => {
            // error callback
            console.error("Error getting user location:", error);
          }
        )
      } else {
        // geolocation is not supported
        console.error("Geolocation is not supported by this browser.");
      }
    }

    return (
      <button type="button" onClick={getUserLocation} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        Get
      </button>
    );
  }

  /**
   * 
   * @returns Reset Component button
   */
  function Reset() {
    const reset = () => {
      console.log(userLocation);
      setUserLocation(null);
      setUserLatitude("");
      setUserLongitude("");
      setUserCity("");
      setUserRegion("");
      setUserDisplayName("");
      setUserMessage("");
    }
    return (
      <button type="button" onClick={reset} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
        Reset
      </button>
    );
  }

  const handleSubmit = (e) => {
    // prevent the browser from reloading the page
    e.preventDefault();

    if (isFormValid) {
      console.log("Running handleSubmit");
      console.log(process.env.NODE_ENV);
      console.log(process.env);

      // read the form data
      const form = e.target;
      const formData = new FormData(form);

      const formJson = Object.fromEntries(formData.entries());
      formJson.location = {
        // "type": "Point",
        "coordinates": [parseFloat(userLatitude), parseFloat(userLongitude)]
      };
      // formJson.location = userLocation;

      console.log(formJson);

      // authorize user
      var ACCESS_TOKEN;
      const auth_url = process.env.NEXT_PUBLIC_MONGODB_AUTH;
      console.log(auth_url);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "username": "lantianqiwillwin@gmail.com",
        "password": "PB2XqFLfX8Z5U7OS"
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://realm.mongodb.com/api/client/v2.0/app/data-tjnjx/auth/providers/local-userpass/login", requestOptions)
        .then(response => response.json())
        .then(result => ACCESS_TOKEN = result.access_token)
        // .then(() => console.log(ACCESS_TOKEN))
        .then(() => {
          const base_url = process.env.NEXT_PUBLIC_MONGODB_ENDPOINT;
          const post_url = `${base_url}/action/insertOne`;

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);

          var raw = JSON.stringify({
            "collection": "feedback-collection",
            "database": "feedback-db",
            "dataSource": "feedback-map-cluster",
            "document": formJson
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch(post_url, requestOptions)
            .then(response => response.json())
            .then(result => {
              console.log(result);
              if (result.insertedId && result.insertedId !== "") {
                alert("Your message is submitted!\nPlease wait for it to appear on the map!")
              }

            })
        })
        .catch(error => console.log('error', error));
      //   {
      //     username: process.env.NEXT_PUBLIC_MONGODB_AUTH_EMAIL,
      //     password: process.env.NEXT_PUBLIC_MONGODB_AUTH_PASSWORD
      //   },
      //   {
      //     headers: { 'Content-Type': 'application/json' }
      //   }
      // ).then((res) => {
      //   console.log(res);

      // ACCESS_TOKEN = res.data.access_token;
      // const base_url = process.env.NEXT_PUBLIC_MONGODB_ENDPOINT;
      // // const port = process.env.NEXT_PUBLIC_TO_BACKEND_PORT;

      // const post_url = `${base_url}/action/insertOne`;
      // console.log(post_url);
      // // insert data
      // axios.post(
      //   post_url,
      //   {
      //     "collection": "feedback-collection",
      //     "database": "feedback-db",
      //     "dataSource": "feedback-map-cluster",
      //     "document": formJson
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       // 'Access-Control-Request-Headers': '*',
      //       'Authorization': `Bearer ${ACCESS_TOKEN}`
      //     }
      //   }
      // )
      //   .then((response) => {
      //     console.log(response);
      //   });

      // console.log("Axios request sent!");
    } else {
      for (const key of Object.keys(errors)) {
        alert(errors[key])
      };
    }
  }
  

  /**
   * 
   * @returns Submit Component button
   */
  function Submit() {
    const { pending } = useFormStatus();
    // handleSubmit(e);
    // console.log("HERE TO SUBMIT");

    return (
      <button
        type="submit"
        disabled={pending}
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        {pending ? "Submitting..." : "Submit"}
      </button>
    );
  }

  return (
    <div className="z-10 max-w-sm w-5/6 items-center justify-between font-sans text-m sm:inline-block mx-8 sm:mx-4 mb-8">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl"> Form </h1>
        <label> name <br />
          <input type="text" value={userDisplayName} name="displayName" onChange={(e) => setUserDisplayName(e.target.value)} required={true} className="border rounded max-w-4xl w-full pl-1" />
        </label> <br />
        <label> message <br />
          <textarea value={userMessage} name="message" onChange={(e) => setUserMessage(e.target.value)} required={true} className="border rounded max-w-4xl w-full pl-1" rows={3} />
        </label> <br />
        <label> latitude <br />
          <input type="text" value={userLatitude} name="userLatitude" readOnly className="border rounded max-w-4xl w-full pl-1" />
        </label> <br />
        <label> longitude <br />
          <input type="text" value={userLongitude} name="userLongitude" readOnly className="border rounded max-w-4xl w-full pl-1" />
        </label>
        <br />
        <label> city <br />
          <input type="text" value={userCity} name="userCity" readOnly className="border rounded max-w-4xl w-full pl-1" />
        </label> <br />
        <label> region <br />
          <input type="text" value={userRegion} name="userRegion" readOnly className="border rounded max-w-4xl w-full pl-1" />
        </label> <br />
        <span className="grid grid-cols-3 gap-4 mt-4">
          <GetGeo />
          <Reset />
          <Submit />
        </span>
      </form>
    </div>
    
  );

}

export default Form;