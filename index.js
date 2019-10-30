const strangerThingsData = require("./strangerThingsData");
const girlsData = require("./girlsData");

let episodeArr = girlsData._embedded.episodes;

const sanitizeText = (text) => {
  // https://css-tricks.com/snippets/javascript/strip-html-tags-in-javascript/
  let htmlStrippedString = text.replace(/(<([^>]+)>)/ig,"");
  let punctuationStrippedString = htmlStrippedString.replace(/[.,:";\/]/g,"");

  return punctuationStrippedString.toLowerCase();
}

const sum = (accumulator, currentValue) => accumulator + currentValue;

let episodeSummary = episodeArr.map(episode => sanitizeText(episode.summary));

const calculateMostCommonString = (episodeArray) => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
  let textArray = episodeArray.flatMap(result => result.split(" "));
  let stringFrequencyObj = {};
  let stringFrequencyArray = [];

  for(let word of textArray) {
    stringFrequencyObj[word] = stringFrequencyObj[word] + 1 || 1;
  }

  // https://stackoverflow.com/questions/11142884/fast-way-to-get-the-min-max-values-among-properties-of-object
  let freqArr = Object.values(stringFrequencyObj);
  let max = Math.max(...freqArr);

  while(stringFrequencyArray.length < 5) {
    for(stringFreq in stringFrequencyObj) {
      if(stringFrequencyObj[stringFreq] === max) {
        stringFrequencyArray.push(`${stringFreq} (${stringFrequencyObj[stringFreq]})`);
      }
    }
    max--;
  }

  return stringFrequencyArray;
}

const firstTimeMentioned = () => {
  var regex = /Marnie/g;

  for(episode of episodeArr) {
    if(episode.summary.match(regex)) {
      return episode.id;
    }
  }
}

const calculateTotalAirtime = () => {
  let episodeAirtimeSeconds = episodeArr.map(episode => {
    return parseFloat(episode.airtime.substring(episode.airtime.indexOf(":") + 1, episode.airtime.length));
  }).reduce(sum);

  let episodeAirtimeMinutes = episodeArr.map(episode => {
    return parseFloat(episode.airtime.substring(0, episode.airtime.indexOf(":")));
  }).reduce(sum);  

  return episodeAirtimeSeconds + (episodeAirtimeMinutes * 60);
}

const calculateAverageNumEpisodes = () => {
  let seasonLengthObj = {};
  let seasonLengthArr = [];

  for(episode of episodeArr) {
    if(episode.number > seasonLengthObj[episode.season] || !seasonLengthObj[episode.season]) {
      seasonLengthObj[episode.season] = episode.number;
    }
  }

  for(season in seasonLengthObj) {
    seasonLengthArr.push(seasonLengthObj[season]);
  }

  return parseFloat((seasonLengthArr.reduce(sum)/seasonLengthArr.length).toFixed(1));
}

const calculateEpochTime = (timestamp) => {
  // https://futurestud.io/tutorials/get-number-of-seconds-since-epoch-in-javascript

  let date = new Date(timestamp); 
  return Math.round(date.getTime() / 1000);
}

const calculateFirstParagraph = (text) => {
  let htmlStrippedString = text.replace(/(<([^>]+)>)/ig,"");
  return htmlStrippedString.substring(0, htmlStrippedString.indexOf(".") + 1);
}

const calculateEpisodeData = () => {
  let episodeData = {};

  for(episode of episodeArr) {
    episodeData[episode.id] = {
      sequenceNumber: `s${episode.season}e${episode.number}`,
      longTitle: `Chapter ${episode.number}: ${episode.name}`,
      airTimestamp: calculateEpochTime(episode.airstamp),
      shortSummary: calculateFirstParagraph(episode.summary)
    };
  }

  return episodeData;
}

const formatShow = () => {
  let formattedShowObj = {};

  formattedShowObj[girlsData.id] = {
    totalDurationSec: calculateTotalAirtime(),
    averageEpisodesPerSeason: calculateAverageNumEpisodes(),
    episodes: calculateEpisodeData()
  };

  // return formatted data
  return formattedShowObj;

  // return episodes inside formatted data 
  // return formattedShowObj[girlsData.id].episodes;
}

// Task A
// console.log(calculateMostCommonString(episodeSummary));

console.log(episodeArr);
// Task B
// console.log(firstTimeMentioned());

// Task C
// console.log(formatShow());