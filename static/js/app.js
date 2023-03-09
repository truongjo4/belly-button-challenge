
// Storing variables for the charts
let id = [];
let samp_values = [];
let otu_id = [];
let otu_label = [];
let demographic_data = [];
let otu_id_string = [];

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
  

// Link to json URL -> loop over data and appending to empty lists    
d3.json(url).then(function(data) {
  for (i = 0; i < data.samples.length; i++) { 
    id.push(data.names[i])
    samp_values.push(data.samples[i].sample_values)
    otu_id.push(data.samples[i].otu_ids);
    otu_label.push(data.samples[i].otu_labels);
    demographic_data.push(data.metadata[i])
    }
        
// Create dropdown values based on each id
let dropdownoptions = document.getElementById("selDataset")
  for (let i = 0; i < id.length; i++) {
    let option = document.createElement("option");
    option.text = id[i];
    option.value = id[i];
    dropdownoptions.add(option)
  }
})

d3.json(url).then(init);


// Create function to grab the first ten values of an array
function getFirstTenValues(arr) {
    if (arr.length > 0) { 
      let firstTenValues = arr.slice(0, 10); 
  
      return firstTenValues; 
    } else {
      console.log('The array is empty.'); 
    }
}

// Create demographic section text section as a function
function demographic_data_creation(index) {
    let demographic_section_text = `
        ID: ${demographic_data[index].id}<br>
        Ethnicity: ${demographic_data[index].ethnicity}<br>
        Gender: ${demographic_data[index].gender}<br>
        Age: ${demographic_data[index].age}<br>
        Location: ${demographic_data[index].location}<br>
        BBtype: ${demographic_data[index].bbtype}<br>
        wfreq: ${demographic_data[index].wfreq}<br>
    `   
    document.getElementsByClassName("panel-body")[0].innerHTML = demographic_section_text  

}
function init() { // Initialise bar, bubble + gauge chart

    // Create variable for string formatting of otu_id (bar graph)
    for (let i = 0; i < otu_id.length; i++) {
        if (otu_id[i].length > 0) {
          let otu_id_mapped = otu_id[i].map(data => `OTU ${data}`);
          otu_id_string.push(otu_id_mapped)
        }
      }
    
    demographic_data_creation(0)
    
    // Bar Graph
    trace1 = [{
        x: getFirstTenValues(samp_values[0].sort((a,b) => b - a)).reverse(),
        y: getFirstTenValues(otu_id_string[0]).reverse(),
        type: 'bar',
        orientation: 'h',
        text: otu_label[0]
    }];

    //Bubble Graph
    trace2 = [{
        x: otu_id[0],
        y: samp_values[0],
        mode: 'markers',
        text: otu_label[0],
        marker: {
            size: samp_values[0],
            color: otu_id[0]
        }
    }];
    // Added xaxis title to bubble graph
    layout2 = {
        xaxis: {
            title: "OTU_ID"
        }
    };

    // Define the data for the gauge chart
    let trace3 = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: 2, // The current value
      gauge: {
        axis: {
          range: [0, 9], // The range of values for the gauge
          tickmode: "array",
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // The tick values for the gauge
          ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "10"], // The labels for the tick values
        },
        bar: {
          color: "black"
        },
        steps: [ // Colors for each step - 
          {range: [0, 1], color: "#6efa8f"},
          {range: [1, 2], color: "#6ddb7e"},
          {range: [2, 3], color: "#6bbd6d"},
          {range: [3, 4], color: "#6a9e5b"},
          {range: [4, 5], color: "#69804a"},
          {range: [5, 6], color: "#676139"},
          {range: [6, 7], color: "#664228"},
          {range: [7, 8], color: "#642416"},
          {range: [8, 9], color: "#630505"},
        ]
      }
    }
  ];
  
  // Add title to the Gauge chart
  var layout3 = {
    title:{
        'text':"<b>Belly Button Washing Frequency</b><br>Scrubs per week"}
  };

  
  Plotly.newPlot("bar", trace1);
  Plotly.newPlot("bubble", trace2, layout2);
  Plotly.newPlot("gauge", trace3, layout3);
}


function optionChanged () {
  let dropdownoptions = d3.select("#selDataset");
  let dataset = dropdownoptions.property("value");

  let update_bar = {}
  let update_bubble = {}
  let update_gauge = {}
  // If dataset is changed, match up with id index and change bar, bubble + demographic data
  for (let i = 0; i < id.length; i++) {
    if (dataset === id[i]) {

      update_bar = {
        x:getFirstTenValues(samp_values[i].sort((a,b) => b - a)).reverse(),
        y:getFirstTenValues(otu_id_string[i]).reverse(),
        type:'bar',
        orientation:'h',
        text: otu_label[i]
      };

      update_bubble = {
        x:otu_id[i],
        y:samp_values[i],
        mode: 'markers',
        text: otu_label[i],
        marker: {
          size: samp_values[i],
          color: otu_id[i]
          }
      };

      update_gauge = {
        value: demographic_data[i].wfreq
      }

      demographic_data_creation(i);
    }
  }
        

  // Changing plots after button is clicked
  Plotly.deleteTraces("bar",[0]);
  Plotly.addTraces("bar", update_bar)

  Plotly.deleteTraces("bubble",[0]);
  Plotly.addTraces("bubble", update_bubble)
    
  Plotly.restyle("gauge", update_gauge)

    
}
