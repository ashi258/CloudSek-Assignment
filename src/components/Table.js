import React,{ useState} from "react";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";

import './Table.css';


const Table = () => {
    const [nrows, setRows] = useState(0);
    const [columns, setColumns] = useState(0);
    const [showTable, setShowTable] = useState(false);
    const [tableArray, setTableArray] = useState([]);
    const [isTableStatic, setIsTableStatic] = useState(false);
    const [cellValues, setCellValues] = useState([]);
    const [recommend, setRecommend] = useState(false);
    const [houseClass, setHouseClass] = useState("");
    const [showCreated, setShowCreated] = useState(false);
    const [rules, setRules] = useState(true);


    const createTable = () => {
        // console.log(nrows);
        // console.log(columns);
        let table = [];
        for (let i = 0; i < nrows; i++) {
        let children = [];
        for (let j = 0; j < columns; j++) {
            children.push(
            <td className={houseClass}>
            {isTableStatic ? (
              cellValues[i] && cellValues[i][j]
                ? cellValues[i][j]
                : "-"
            ) : (
                <input className="input" type="text" value={cellValues[i] && cellValues[i][j] ? cellValues[i][j] : ""}
                onChange={(e) => {
                  let newCellValues = [...cellValues];
                  if (!newCellValues[i]) {
                    newCellValues[i] = [];
                  }
                  newCellValues[i][j] = e.target.value;
                  setCellValues(newCellValues);
                }}>
                </input>
            )}
            </td>
            );
        }
        table.push(<tr>{children}</tr>);
        }
        return table;
    }

    const createArray = () => {
        let tb = document.getElementById("myTable");;
        let arr = [];
        for(let i=0;i<nrows;i++)
        {
            let smallarr = [];
            for(let j=0;j<columns;j++)
            {
                smallarr.push(tb.rows[i].cells[j].innerHTML);
            }
            arr.push(smallarr);
            smallarr = [];
        }
       setTableArray(arr);

    }
    //console.log(tableArray);

    let matrix = tableArray;

    const findNearestHouse = () => {
        let n = matrix.length;
        let m = matrix[0].length;
      
        let gym = [-1, -1];
        let restaurant = [-1, -1];
        let hospital = [-1, -1];
        let houses = [];
      
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < m; j++) {
            if (matrix[i][j].toLowerCase().includes("gym")) {
              gym = [i, j];
            }
            if (matrix[i][j].toLowerCase().includes("restaurant")) {
              restaurant = [i, j];
            }
            if (matrix[i][j].toLowerCase().includes("hospital")) {
              hospital = [i, j];
            }
            if (matrix[i][j].toLowerCase().includes("house")) {
              houses.push([i, j]);
            }
          }
        }
      
        let distances = Array(houses.length).fill(Number.MAX_SAFE_INTEGER);
      
        let minDistance = function(house, point) {
          let dx = Math.abs(house[0] - point[0]);
          let dy = Math.abs(house[1] - point[1]);
          return dx + dy;
        };
      
        for (let i = 0; i < houses.length; i++) {
          distances[i] = Math.min(
            distances[i],
            minDistance(houses[i], gym)
          );
          distances[i] = Math.min(
            distances[i],
            minDistance(houses[i], restaurant)
          );
          distances[i] = Math.min(
            distances[i],
            minDistance(houses[i], hospital)
          );
        }
      
        let minIndex = 0;
        for (let i = 1; i < distances.length; i++) {
          if (distances[i] < distances[minIndex]) {
            minIndex = i;
          }
        }

        let recommendedHouse = []
        recommendedHouse.push(
            <div>
                {tableArray[houses[minIndex][0]][houses[minIndex][1]]}
            </div>
        )
        console.log(tableArray[houses[minIndex][0]][houses[minIndex][1]]);
        return recommendedHouse;
      }

    
    return (
      
        <div>
          <h1>House Recommendation</h1>
        <div className="rowCol">
            <TextField
                id="outlined-number"
                label="Rows"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value = {nrows}
                onChange={(e) => setRows(e.target.value)}
            />
            <TextField
                id="outlined-number"
                label="Columns"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
            />
            <div className="buttons">
                <Button onClick={()=>{
                    setShowTable(true)
                    setHouseClass("")
                    setShowCreated(false);
                    setRecommend(false)
                    setRules(true)
                    }}>Create Table</Button>
                {}
                <Button onClick={() => {
                setIsTableStatic(false)
                setHouseClass("")
                setShowCreated(false);
                setRecommend(false)
                setRules(true)
                }}>
                    EDIT TABLE
                </Button>
                <br />
                <Button onClick={()=>{
                    setIsTableStatic(true) 
                    setShowCreated(true);
                    setRules(false);
                    setRecommend(false)
                    setHouseClass("house")
                    
                }
                }>Finalize the Layout</Button>

                <Button onClick={()=>
                {
                    createArray()
                    setRecommend(true)
                    setHouseClass("house")
                    setShowCreated(false);
                }}>Recommend Best house</Button>
        </div>
        </div>
            <br />
            
            {showTable && 
            (<div className="tab">
                <table id="myTable">
                <tbody>{createTable()}</tbody>
                </table>
            </div>)
            }
            {
                showCreated &&
                (
                    <div className="finalized">Done! Layout Finalized</div>
                )
            }
            {
                recommend &&
                (
                    <div className="final">
                    <button className="close" onClick={()=>setRecommend(false)}>X</button>
                        Recommended House is <h4>{findNearestHouse()}</h4>
                    </div>
                )
            }

            {
                rules && 
                (
                    <ul  className="rules">
                        <h2>Rules:</h2>
                        <li>1) We have 4 choices to fill.</li>
                        <h4>House, Restaurant, Gym and Hospital.</h4>
                        <li>2) We can give numbers to houses like house 1, house 2 etc..</li>
                        <li>3) Restaurant, Gym and Hospital can only be 1-1 each.</li>
                        <li>4)Restaurant, Gym and Hospital Can either be in same cell <br /> or different cell.</li>
                        <li>5)Flow of Table</li>
                        <ol>
                            <li>Input number of rows and columns</li>
                            <li>CREATE TABLE</li>
                            <li>EDIT TABLE (only if you filled the inputs wrong)</li>
                            <li>FINALIZE THE LAYOUT</li>
                            <li>GET RECOMMENDATION</li>
                        </ol>
                    </ul>
                )
            }
        </div>
        
    )
}

export default Table;