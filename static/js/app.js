// Event planner that waits for the HTML page to be loaded before things are coded
// Storing variables for the charts
let id = [];
let samp_values = [];
let otu_id = [];
let otu_label = [];
let demographic_data = [];

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// This first line allows all the HTML to load first before this starts
document.addEventListener('DOMContentLoaded', function() {
  
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
});

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
function init() {

    // Reformat otu_id 
    for (let i = 0; i < otu_id.length; i++) {
        if (otu_id[i].length > 0) {
          otu_id[i] = otu_id[i].map(data => `OTU ${data}`);
        }
      }
    
    demographic_data_creation(0)
    
    // Bar Graph
    trace1 = [{
        x: getFirstTenValues(samp_values[0].sort((a,b) => b - a)).reverse(),
        y: getFirstTenValues(otu_id[0]).reverse(),
        type: 'bar',
        orientation: 'h'
    }];

    //Bubble Graph
    trace2 = [{
        x: otu_id[0],
        y: samp_values[0],
        mode: 'markers',
        marker: {
            size: samp_values[0]
        }
    }];


    Plotly.newPlot("bar", trace1);
    Plotly.newPlot("bubble", trace2)
}

d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged () {
    let dropdownoptions = d3.select("#selDataset");
    let dataset = dropdownoptions.property("value");

    let x = []
    let y = []

    for (let i = 0; i < id.length; i++) {
        if (dataset === id[i]) {
            x = getFirstTenValues(samp_values[i].sort((a,b) => b - a)).reverse();
            y = getFirstTenValues(otu_id[i]).reverse()
            demographic_data_creation(i)
        }

    }
    
    Plotly.restyle("bar", "x", [x]);
    Plotly.restyle("bar", "y", [y]);
} 







