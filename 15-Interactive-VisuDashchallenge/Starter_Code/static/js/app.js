function DrawBarChart(desiredsampleID)
{
    console.log("DrawBarChart: sample = ", desiredsampleID);

    d3.json("samples.json").then((data) => {
        var samples=data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == desiredsampleID);
        var result = resultArray[0];
        var otu_ids= result.otu_ids;
        var otu_labels=result.otu_labels;
        var sample_values = result.sample_values;
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            { 
                x: sample_values.slice(0,10).reverse(),
                y: yticks,
                type:"bar",
                text: otu_labels.slice(0,10).reverse(),
                orientation:"h"
            }
        ];
        var barLayout = {
            title: "Top 10 Bacteria cultures Found",
            margin: {t:30, l:150}
        };
       
        Plotly.newPlot("bar", barData, barLayout);

    });
}

function DrawBubbleChart(bubblesampleID)
{
    console.log("DrawBubbleChart: sample = ", bubblesampleID);
    d3.json("samples.json").then((data) => {
        var samples=data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == bubblesampleID);
        var result = resultArray[0];
        var otu_ids= result.otu_ids;
        var otu_labels=result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size:sample_values,
                    color:otu_ids,
                    colorscale:"Earth",
                }
            }
        ];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t:0},
            hovermode:"closest",
            xaxis:{title: "OTU ID"},
            margin: {t :30}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    });
}

function ShowMetaData(metasampleID)
{
    console.log("ShowMetaData: sample = ", metasampleID);
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == metasampleID);
        var result = resultArray[0];
        var BOX = d3.select("#sample-metadata");
        BOX.html("");
        Object.entries(result).forEach(([key, value]) => {
            var textToShow = `${key.toUpperCase()}: ${value}`;
            BOX.append("h6").text(textToShow);
        });
    });
}

function optionChanged(newSampleID)
{
    console.log("Dropdown changed to: ", newSampleID);
    DrawBarChart(newSampleID);
    ShowMetaData(newSampleID);
    DrawBubbleChart(newSampleID);

}

function Init()
{
    console.log("Initializing Screen");
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sampleID) => {
            selector
                .append("option")
                .text(sampleID)
                .property("value", sampleID);
        });
        var sampleID=sampleNames[0];

        DrawBarChart(sampleID);
        ShowMetaData(sampleID);
        DrawBubbleChart(sampleID);
    });

}

Init();