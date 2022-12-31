const server = 'http://localhost:3000';
var raceDate;
var raceTime;
var raceDistance;
var raceID;

async function fetchRaces() {
    const url = server + '/races';
    const options = {
        method: 'GET',
        headers: {
            'Accept' : 'application/json'
        }
    }
    const response = await fetch(url, options);
    const races = await response.json();
    populateContent(races);
    mychart(races); 
}


//ADDING A NEW RACE TIME
async function addRace() {
    const url = server + '/races';
    const race = {id: raceID, date: raceDate, time:raceTime, dist:raceDistance};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(race),

    }
    const response = await fetch(url, options);
    fetchRaces();
}

// POLULATING THE TABLE
function populateContent(races) {

    var table = document.getElementById('content');
    table.innerHTML = "<tr><th>Date</th><th>Time(s)</th><th>Distance(m)</th></tr>";

    races.forEach(race => {
    
        var row = document.createElement('tr');
        var dataDate = document.createElement('td');
        var textDate = document.createTextNode(race.date);
        var dataTime = document.createElement('td');
        var textTime = document.createTextNode(race.time);
        var dataDistance = document.createElement('td');
        var textDistance = document.createTextNode(race.dist);
        
        // delete button
        var deleteButton = document.createElement('button')
        var deleteText = document.createTextNode('Delete')
        deleteButton.appendChild(deleteText)
        deleteButton.value = race.id;

        deleteButton.value = race.id;
        dataDate.appendChild(textDate);
        dataTime.appendChild(textTime);
        dataDistance.appendChild(textDistance);
        row.appendChild(dataDate);
        row.appendChild(dataTime);
        row.appendChild(dataDistance);
        row.appendChild(deleteButton)
        table.appendChild(row);

    });
    deleteRaces(races);
}

// DELETING A RACE TIME
async function deleteRaces(races) {
    races.forEach(race => {
        const options = {
            method: 'POST', 
            header: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify(race)
        }

        let deleteButton = document.querySelector(`button[value='${race.id}']`)
        deleteButton.addEventListener('click', async () => {
            const url = server + `/races/${race.id}/delete`;
            const response = await fetch(url, options);
            const remainingRaces = await response.json();
            console.log(remainingRaces);
            populateContent(remainingRaces)
            fetchRaces();

        });
    }); 
}
// UPDATING A RACE TIME

// CALCULATING THE MEDIAN
function calculateMedian(RaceTimes) {
    if(RaceTimes.length==0){
        return 0;
    }
    const sortedTimes = RaceTimes.sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedTimes.length / 2);
    if (sortedTimes.length % 2 === 0) {
        return (sortedTimes[middleIndex - 1] + sortedTimes[middleIndex]) / 2; //EVEN

    }
    else{
        return sortedTimes[middleIndex]; // ODD
    }
}


// CHARTING THE RACE TIMES
async function mychart(races){    
    const ctx = document.getElementById('raceChart').getContext('2d');
    const ctx2 = document.getElementById('raceChart2').getContext('2d');

    // Get all the data from the json file
    var chartDates= races.map(function(elem){
        return elem.date;
    });
    var chartTime= races.map(function(elem){
        return elem.time;
    });
    var chartDistance= races.map(function(elem){
        return elem.dist;
    });

    // split the data into 100m races and 200m races
    var onehunTimes=[];
    var onehundDates=[];

    var twohunTimes=[];
    var twohundDates=[];

    for (let i = 0; i < chartDistance.length; i++) {
        if(chartDistance[i] == 100){
            onehunTimes.push(chartTime[i])
            onehundDates.push(chartDates[i])
        }
        else{
            twohunTimes.push(chartTime[i])
            twohundDates.push(chartDates[i])
        }
    }
    // Calculate the Median Times
    var onehunMedian= calculateMedian(onehunTimes);
    document.getElementById("median1").innerHTML = "Median Race Time: "+onehunMedian;
    var twohunMedian= calculateMedian(twohunTimes);
    console.log("twohunmedain", twohunMedian)
    document.getElementById("median2").innerHTML = "Median Race Time: "+twohunMedian;

    //100m chart
    var myChartoneHundered= new Chart(ctx, {
        type:'line', 
        data:{
            labels: onehundDates,
            datasets:[{
                label:'100m Race',
                data: onehunTimes,
                backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth:1
            }
        ]
        },
        options:{
            responsive:true,
            scales:{
                yAxes:[{
                    tickes:{
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    //200m chart
    var myCharttwoHundered= new Chart(ctx2, {
        type:'line', 
        data:{
            labels: twohundDates,
            datasets:[{
                label:'200m Race',
                data: twohunTimes,
                backgroundColor:[
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth:1
            }
        
        ]
        },
        options:{
            scales:{
                yAxes:[{
                    tickes:{
                        beginAtZero:true
                    }
                }]
            }
        }
    });

}


document.querySelector('form').addEventListener('submit', (e) => {
    raceID=Date.now();
    raceDate = document.getElementById('raceDate').value;
    raceTime = parseInt(document.getElementById('raceTime').value);
    raceDistance= document.querySelector('input[name="raceDistance"]:checked').value;
    if (raceDate && raceTime && raceDistance) {
        addRace();
        fetchRaces();
    }
    e.preventDefault();
});

