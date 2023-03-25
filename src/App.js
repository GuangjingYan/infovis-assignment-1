import React from "react";
import Scatterplot from "./components/Scatterplot";
import Mainplot from "./components/Mainplot";

import datasaurus from "./data/datasaurus.json";

import "./App.css";


function App() {

  const name = "Guangjing Yan"
  const studentNum = "2020-2XXXX"


  const mainWidth = 200;
  const subWidth = 150;
  const margin = 20;
  const radius = 1.5;
  const barPadding = 0.3

  let keys = Object.keys(datasaurus);
  keys = keys.filter(d => d !== "dino");



  return (
    <div className="App">
      <div class="splotContainer">
        <h1 style={{marginRight: 10}}>
        {"Assignment #1 /"}
        </h1>
        <h2 style={{marginTop: 25}}>
          {name + " (" + studentNum + ")"}
        </h2>
      </div>
      <div class="splotContainer">
        <Mainplot
          size={mainWidth}
          data={datasaurus.dino}
          margin={margin}
          radius={radius}
          barPadding={barPadding}
        />
      </div>
      <div class="splotContainer">
      {
        keys.slice(0, 4).map(key => { 
          return (<Scatterplot
            size={subWidth}
            data={datasaurus[key]}
            margin={margin}
            radius={radius}
          />)
        })
      }
      </div>
      <div class="splotContainer">
      {
        keys.slice(4, 8).map(key => { 
          return (<Scatterplot
            size={subWidth}
            data={datasaurus[key]}
            margin={margin}
            radius={radius}
          />)
        })
      }
      </div>
    </div>
  );
}

export default App;
