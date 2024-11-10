import React, { useState } from "react";

const END_POINT = 'http://0.0.0.0:5000'

const FetchData = () => {
    fetch(END_POINT, {method: 'GET'})
    .then(res => res.json())
    .then(data => {
        
    })
}