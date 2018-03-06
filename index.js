/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/** 
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const recipes = require('./recipes');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const handlers = {
    // Implemented
    'startTheMeeting': function () { // introduce and then pass to help intent to list functions
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE');
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
        
        // right now just tell .. need to figure how I can pass to help intent
        this.emit(':tell', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.HelpIntent': function () { // tells what it can do
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':tell', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },    
    //In progress - MVP
    'tellMeAbout': function () { // tells about a requested attendee
        
        const attendeeSlot = this.event.request.intent.slots.attendee;
        const resolutionStatus = attendeeSlot.resolutions.resolutionsPerAuthority[0].status.code;

        console.log('attendeeSlot=',attendeeSlot);
        console.log('attendeeSlot.value=',attendeeSlot.value);
        console.log('attendeeSlot.resolutions=',attendeeSlot);
        console.log('resolutionStatus=',resolutionStatus);

        // see if name was provided
        if  (!(attendeeSlot && attendeeSlot.value)) {
            // name not provided, ask for it
            this.attributes.speechOutput = "Who do you want to know about?";
            this.emit(':elicitSlot', 'attendee',this.attributes.speechOutput);
        } else if ( resolutionStatus != 'ER_SUCCESS_MATCH' ) {
            this.attributes.speechOutput = "I don't recognize the name, " + attendeeSlot.value + ",  Please repeat the person's name.";
            this.emit(':elicitSlot', 'attendee',this.attributes.speechOutput);
        } 
        else {
            //we have name, so get info on attendee from slot 
            const attendeeSpoken = attendeeSlot.value;
            const attendeeValue = attendeeSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name; // persons name
            const attendeeAlias = attendeeSlot.resolutions.resolutionsPerAuthority[0].values[0].value.id; // amazon alias
            console.log('attendeeSpoken=',attendeeSpoken);
            console.log('attendeeValue=',attendeeValue);
            console.log('attendeeAlias=',attendeeAlias);
            

            // using the alias from the slot as the key, get the attendee record from database
            const attendeeRecord = attendees[attendeeAlias];
            console.log('attendeeRecord=',attendeeRecord);

            // get alias from slot
            let posPronoun = attendeeRecord.posPronoun;
            console.log('posPronoun=',posPronoun);
            let objPronoun = attendeeRecord.objPronoun;
            console.log('objPronoun=',objPronoun);
            let pronoun = attendeeRecord.pronoun;
            console.log('pronoun=',pronoun);
            let hometown = attendeeRecord.hometown;
            console.log('hometown=',hometown);
            let college = attendeeRecord.college;
            console.log('college=',college);
            let favTune = attendeeRecord.favsong;
            console.log('favTune=',favTune);
            let subjectLNF = attendeeRecord.lnf;
            console.log('subjectLNF=',subjectLNF);

            //this.attributes.speechOutput = this.t('COMPLETE_INFO', attendeeValue, hometown, pronoun, college, posPronoun, favTune );
            //this.attributes.speechOutput += " Do you want to know a little known fact about " + attendeeValue + "?";
            
            this.attributes.speechOutput = this.t('COMPLETE_INFO_LNF', attendeeValue, hometown, pronoun, college, posPronoun, favTune, posPronoun, objPronoun, subjectLNF );

            // delegating to alexa dialog model if the state is not complete  TODO: change to elicit LNF
            console.log('speechOutput=',this.attributes.speechOutput);
            this.emit(':tell', this.attributes.speechOutput);
        }
    },
    'tellHowYouWork': function () { // tells what it can do
        this.attributes.speechOutput = this.t('HOWWORK_MESSAGE');
        this.emit(':tell', this.attributes.speechOutput, this.attributes.repromptSpeech);
    }, 
    /*
    'giveFact': function () { // ramdomly selects a fact of the requested type from list of attendees
        
        const factTypeSlot = this.event.request.intent.slots.factType;
        console.log('attendeeSlot=',factTypeSlot);
        console.log('attendeeSlot.value=',attendeeSlot.value);
        console.log('attendeeSlot.resolutions=',attendeeSlot);

        // see if name was provided
    } else if ((attendeeSlot.resolutions.resolutionsPerAuthority.length > 0) && (attendeeSlot.resolutions.resolutionsPerAuthority.values.length > 0)) {
        
       
        if  (!(attendeeSlot && attendeeSlot.value)) {
            // name not provided, ask for it
            this.attributes.speechOutput = "Who do you want to know about?";
            this.emit(':elicitSlot', 'attendee',this.attributes.speechOutput);
        // if fact type is specified, select one from the list and tell it

        // else elicit the slot value


        this.attributes.speechOutput = this.t('HOWWORK_MESSAGE');
        this.emit(':tell', this.attributes.speechOutput, this.attributes.repromptSpeech);
    }, */
    'askLNFRandomP': function () {
        if (this.event.request.dialogState === 'STARTED') {
             // pick the person

            // get their little known fact

            let updatedIntent = this.event.request.intent;
            // Pre-fill slots: update the intent object with slot values for which
            // you have defaults, then emit :delegate with this updated intent.
            // pass on this intent.  Give instruction
            this.attributes.speechOutput = "OK.  I'm going to give you a litte known fact about one of our team members.  I need a single name as a reponse.  One response at a time, so raise your hand if you have guess.  Here we go.";
 
           // fix thisw
            updatedIntent.slots.SlotName.value = 'DefaultValue';
            this.emit(':delegate', updatedIntent);
        } else if (this.event.request.dialogState !== 'COMPLETED'){
            // delegating to alexa dialog model if the state is not complete
            this.emit(':delegate');
        } else {
            this.attributes.speechOutput = "OK.  I'm going to give you a litte known fact about one of our team members.  I need a single name as a reponse.  One response at a time, so raise your hand if you have guess.  Are you ready?";
            this.emit(':ask', this.attributes.speechOutput);
        }
    },
    // for future versions
    'whereWeAt': function () {
        this.attributes.speechOutput = "where we at has not been implemented ye";
        this.emit(':tell', this.attributes.speechOutput);
    },
    'showOneDayAgenda': function () {
        this.attributes.speechOutput = "show day one agenda has not been implemented ye";
        this.emit(':tell', this.attributes.speechOutput);
    },
    'showTwoDayAgenda': function () {
        this.attributes.speechOutput = "show dat two agenda has not been implemented ye";
        this.emit(':tell', this.attributes.speechOutput);
    },
    'takeRoll': function () {
        this.attributes.speechOutput = "take roll has not been implemented ye";
        this.emit(':tell', this.attributes.speechOutput);
    },   
    'askRandomQrandomPerson': function () {
        this.attributes.speechOutput = "ask random question has not been implemented ye";
        this.emit(':tell', this.attributes.speechOutput);
    },   
    'askHometownRandomP': function () {
        this.attributes.speechOutput = "ask hometown question has not been implemented yet";
        this.emit(':tell', this.attributes.speechOutput);
    },
    'askCollegeRandomP': function () {
        this.attributes.speechOutput = "ask college question has not been implemented ye";
        this.emit(':tell', this.attributes.speechOutput);
    },

    //keeping this around for now for sample code use
    'RecipeIntent': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myRecipes = this.t('RECIPES');
        const recipe = myRecipes[itemName];

        if (recipe) {
            this.attributes.speechOutput = recipe;
            this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
            this.emit(':askWithCard', recipe, this.attributes.repromptSpeech, cardTitle, recipe);
        } else {
            let speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en-US': {
        translation: {
            // in use
            SKILL_NAME: 'Virtual Mike',
            WELCOME_MESSAGE: "Hello and welcome to Nashville!  I\'m virtual Mike.  I\'ll be your meeting companion for the next two days.  My goal is to help you learn some things about your teammates that you might not know.  If you want to know more, ask me for help",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "I can tell you about someone on the team including a little known fact they'd like you to know.  Just say for example, alexa, tell Virtual Mike to tell me about Bob Hardin.  If I don't recognize a name, try saying the first name only.",
            COMPLETE_INFO: "%s is from %s., %s went to %s., %s favorite song is %s.",
            COMPLETE_INFO_LNF: "%s is from %s., %s went to %s., %s favorite song is %s., In %s own words here's something you might not know about %s., %s",
            LNF_INFO: "Here is a little known fact about %s",

            
            HOWWORK_MESSAGE: "My dialog model which defines what you say and how i respond is defined on developer.amazon.com.  A single lambda function on AWS has the rest of my logic.  Information about the team is held in dynamo DB.  I pull information from a table in dynamo DB to get the information that I share with you.",
            // not in use
            RECIPES: recipes.RECIPE_EN_US,
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_REPROMT: "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
};

// hope to replace this to either pull file from S3 or use DynamoDB as datasource
const attendees = {
    "johngunn": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Atlanta, GA",
       "college": "Georgia Tech",
       "lnf": "In college, I went on a blind date to the UVA Kappa Christmas formal with the granddaughter of Lydon Baines Johnson.  The next morning I woke up on her floor wrapped in an old blanket that had the name Sissy Byrd embroidered on it. I left shortly thereafter and never saw her again.",
       "favsong": "Semi-Charmed Life by Third Eye Blind",
       "favsongurl": "https://music.amazon.com/albums/B0012QLX1Q?trackAsin=B0012QLMIU&ref=dm_sh_1c7e-ae7e-dmcp-758e-0c242&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "johngunn@amazon.com",
       "favsongcomment": ""
    },
    "miksalvi": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Syracuse, NY",
       "college": "Virginia Tech",
       "lnf": "My first purchase online, in 1995, was a Crocodile.  ",
       "favsong": "Don't stop Believing by Journey",
       "favsongurl": "https://music.amazon.com/albums/B00138H45W/B00137GHF6/CATALOG",
       "lastUsedTime": "",
       "emailaddress": "miksalvi@amazon.com",
       "favsongcomment": ""
    },
    "knowled": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Fairfax, VA",
       "college": "Purdue University",
       "lnf": "I was chased by a Springbok (antelope) while on safari in South Africa. Luckily I was a faster runner at the time and made it back to the truck safely. ",
       "favsong": "Moondance by Van Morrison",
       "favsongurl": "https://music.amazon.com/albums/B00FR0M5G0/B00FR0M6JQ/CATALOG",
       "lastUsedTime": "",
       "emailaddress": "knowled@amazon.com",
       "favsongcomment": ""
    },
    "bromad": {
       "pronoun": "she",
       "posPronoun": "her",
       "objPronoun": "her",
       "hometown": "Mishawaka, IN",
       "college": "Oxford College, Emory University, and Northwestern's Kellogg School of Management",
       "lnf": "If I could only eat one thing forever it would be chilled Gerber strawberry banana baby food.",
       "favsong": "Regulate By Warren G and Nate Dogg",
       "favsongurl": "https://music.amazon.com/albums/B001KQM0PQ?trackAsin=B001KQIJBK&ref=dm_sh_4304-c9f2-dmcp-1fcd-28d55&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "bromad@amazon.com",
       "favsongcomment": "Power of a WOMAN!  Bye the way, Darci's song link was to bing not Amazon Music.  Darci, please report to Doppler for re-ascimilation."
    },
    "kleindld": {
        "pronoun": "she",
        "posPronoun": "her",
        "objPronoun": "her",
        "hometown": "Ellensburg, WA",
       "college": "University of Wasington",
       "lnf": "Back in my day, I partially afforded college by modeling for Nordstrom, Bon Marche, Nike, and smaller brand clothing lines.  Additionally, I was in the Miss Photogenic pageant, was a hair model, and on a traveling performing Nike bench aerobic team.  It was not glamorous but it paid my beer bills!",
       "favsong": "Long Cool Woman in a Black Dress by the Hollies",
       "favsongurl": "https://www.bing.com/search?q=woman+in+a+black+dress+song&form=EDGHPT&qs=AS&cvid=819108597bc0496db4a94bb57f83561b&cc=US&setlang=en-US",
       "lastUsedTime": "",
       "emailaddress": "kleindld@amazon.com",
       "favsongcomment": ""
    },
    "smithazm": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Grand Rapids, MI",
       "college": "Florida State University",
       "lnf": "I am the first person in my family to go to college, paid my own way through, and prior to that worked 12 hour shifts in the freezer of a Dairy, Changed Oil, auto mechanic, worked in a Lumber Mill, Bartended, and waited tables.",
       "favsong": "Come and Get your Love by Redbone",
       "favsongurl": "https://music.amazon.com/albums/B074N13L62?trackAsin=B074N1S6FG&ref=dm_sh_60e4-2450-dmcp-dcc2-57b8b&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "smithazm@amazon.com",
       "favsongcomment": "It a one hit wonder."
    },
    "dtuck": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "San Pedro, CA",
       "college": "University of Texas at Austin",
       "lnf": "One fact is simply not enough.  I have three.  First, My favorite TV cartoon show growing up was the Mighty Hero's and the best character was Rope Man! Second, I climbed Mt Ranier in 2016 in the middle of the night with a headlamp and a pick axe. Finally, I have swallowed a goldfish whole...on purpose.",
       "favsong": "Play that Funky Music by Wild Cherry",
       "favsongurl": "https://music.amazon.com/albums/B00138CQNC/B00137G8MS/CATALOG",
       "lastUsedTime": "",
       "emailaddress": "dtuck@amazon.com",
       "favsongcomment": "When I was 7 years old, I heard Funky Town and that was it. I LOVED it. I waited by the radio to hear it again. When it came on again, I turned the radio off so I could go grab my family to hear it too. We all gathered around a 6\"x 10\" AM/FM radio. I can remember it like it was yesterday. I turned the radio back on to find out it had NOT saved my spot. I was very disappointed."
    },
    "olsonmo": {
        "pronoun": "she",
        "posPronoun": "her",
        "objPronoun": "her",
        "hometown": "Minneapolis, MN",
       "college": "St. Cloud State University",
       "lnf": "I have been with my husband since 8th grade. We would ride bicycles together until we could drive. When he turned 16, he bought a 1970 Chevelle. He fixed it up and added a blower. We would race it at Brainerd International Raceway. Our kids learned to ride their bicycles on the track. I once placed 3rd in the powder puff out of 125 women. I was actually supposed to go to the line to race for first but I didn't realize the other women had broke the line (started too early)and I headed back to the pit to be with my family. That day I had my best reaction time and 1/4 mile time. ",
       "favsong": "Funky Town By Lipps, Inc.",
       "favsongurl": "https://music.amazon.com/albums/B003Z14KOI?trackAsin=B003Z10OSY&ref=dm_sh_5f57-729b-dmcp-a9e4-687e6&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "olsonmo@amazon.com",
       "favsongcomment": ""
    },
    "johnalli": {
        "pronoun": "she",
        "posPronoun": "her",
        "objPronoun": "her",
        "hometown": "Saint Louis, MO",
       "college": "UC Santa Barbara",
       "lnf": "I came in 2nd place in the Non-wetsuit division in the Escape from Alcatraz open water swim race many years ago.",
       "favsong": "Candy by Cameo",
       "favsongurl": "https://music.amazon.com/artists/B000RHNSKK/CATALOG?ref=dm_wcp_artist_link_pr_s",
       "lastUsedTime": "",
       "emailaddress": "johnalli@amazon.com",
       "favsongcomment": ""
    },
    "doughme": {
        "pronoun": "she",
       "posPronoun": "her",
       "objPronoun": "her",
       "hometown": "Nashua, NH",
       "college": "Northeastern University",
       "lnf": "I won a championship jump roping contest which led to my love of crossfit!  (True story)",
       "favsong": "Pour some sugar on me  by Def Leppard",
       "favsongurl": "https://music.amazon.com/albums/B01LVV5EEQ?trackAsin=B01LVV640R&ref=dm_sh_2cb1-f6a2-dmcp-eff5-f8f7d&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "doughme@amazon.com",
       "favsongcomment": ""
    },
    "bartosea": {
        "pronoun": "she",
       "posPronoun": "her",
       "objPronoun": "her",
       "hometown": "Methuen, MA",
       "college": "Northern Essex",
       "lnf": "I am an amazing Karaoke singer.",
       "favsong": "Something Just Like This by The Chainsmokers and Coldplay",
       "favsongurl": "https://music.amazon.com/albums/B06VWPKSB5?trackAsin=B06VWVWDDH ",
       "lastUsedTime": "",
       "emailaddress": "bartosea@amazon.com",
       "favsongcomment": ""
    },
    "mortonly": {
        "pronoun": "she",
        "posPronoun": "her",
        "objPronoun": "her",
        "hometown": "Louisville, KY ",
       "college": "University of missouri and SE Missouri State",
       "lnf": "I'm an artist ",
       "favsong": "Broken by Seether (featuring Amy Lee)",
       "favsongurl": "https://music.amazon.com/albums/B00KX5IIW4/B00KX5JALC/CATALOG",
       "lastUsedTime": "",
       "emailaddress": "mortonly@amazon.com",
       "favsongcomment": ""
    },
    "hardirob": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Visalia, CA",
       "college": "Dartmouth College",
       "lnf": "I served on the California Future Farmers of America (F.F.A.) State Champion Citrus Judging Team, in 1998.",
       "favsong": "Take Five, Dave Brubeck",
       "favsongurl": "https://music.amazon.com/artists/B00G6AKCD8?ref=dm_sh_f027-784f-dmcp-3581-7ae21&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "hardirob@amazon.com",
       "favsongcomment": ""
    },
    "jasowar": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Louisville, KY ",
       "college": "University of Kentucky ",
       "lnf": "I started my first business when I was five years old. It was a Landscaping company. It was called Pooper Scoopers. For $5 a visit, I would scoop your dog's poop off your lawn. After a profitable one summer, I closed the business to pursue normal child activities at that age.",
       "favsong": "This Must Be The Place (Naive Melody) by Talking Heads",
       "favsongurl": "https://music.amazon.com/albums/B001OB662K/B001OB992O/CATALOG",
       "lastUsedTime": "",
       "emailaddress": "jasowar@amazon.com",
       "favsongcomment": ""
    },
    "jarcara": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Buffalo, NY",
       "college": "D'Youville College",
       "lnf": "My family was involved with the Buffalo Mafia.",
       "favsong": "Don't stop me now by Queen",
       "favsongurl": "https://music.amazon.com/albums/B017JXSVZG?trackAsin=B017JXT31W&ref=dm_sh_7327-e73f-dmcp-b674-4e67b&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "jarcara@amazon.com",
       "favsongcomment": ""
    },
    "rppetti": {
        "pronoun": "she",
        "posPronoun": "her",
        "objPronoun": "her",
       "hometown": "Cleveland, OH",
       "college": "Kent State University",
       "lnf": "I can touch my tongue to my nose",
       "favsong": "Songs by Stevie Nicks and Rhianna",
       "favsongurl": "https://music.amazon.com/albums/B01B8I4AN0?trackAsin=B01B8I3X7O&ref=dm_sh_7c85-13d5-dmcp-0e35-6001f&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "rppetti@amazon.com",
       "favsongcomment": ""
    },
    "rielahje": {
        "pronoun": "she",
       "posPronoun": "her",
       "objPronoun": "her",
       "hometown": "Quezon City, Philippines",
       "college": "Ateneo De Manila University, Philippines",
       "lnf": "I am currently a Brown belt in Tae Kwon Do and I, drive a Mini-Cooper I named Peppa.",
       "favsong": "This Is What You Came For By Calvin Harris (featuring Rihanna)",
       "favsongurl": "https://music.amazon.com/albums/B01EYBGV8U?trackAsin=B01EYBGW4S&ref=dm_sh_56db-c991-dmcp-eeb2-a118b&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "rielahje@amazon.com",
       "favsongcomment": ""
    },
    "dowli": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Saugus, MA",
       "college": "Plymouth State University (BS), University of Iowa (MBA)",
       "lnf": "I have a few tattoos.",
       "favsong": "Fox on the Run By The Sweet",
       "favsongurl": "https://music.amazon.com/albums/B01N7Z30HQ/CATALOG?ref=dm_wcp_albm_link_trsnpt",
       "lastUsedTime": "",
       "emailaddress": "dowli@amazon.com",
       "favsongcomment": ""
    },
    "scotcar": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Thebes, IL",
       "college": "Southeast Missouri State",
       "lnf": "I grew up in a town with a population of 450 people, Thebes, IL.  The first 22 years of my life were influenced by the people, the values and the culture of that small farm town.  I won't mention that I have a playlist built for every year from 1980 - 1990 - love that 80's music!",
       "favsong": "Mountain Music By Alabama",
       "favsongurl": "https://music.amazon.com/albums/B001DD69HQ/B001DD0RFQ/CATALOG?ref=dm_wcp_albm_link_search_c ",
       "lastUsedTime": "",
       "emailaddress": "scotcar@amazon.com",
       "favsongcomment": ""
    },
    "wsaxe": {
       "pronoun": "he",
       "posPronoun": "his",
       "objPronoun": "him",
       "hometown": "Portland, OR",
       "college": "George Washington University",
       "lnf": "I took time off of college to live in London where I worked in a white collar legal consultancy and ended up playing a very minor part on the defense team for Slobadan Milosevic. Needless to say I was vastly under qualified for the responsibility which was probably best for my Karma.",
       "favsong": "Eleanore Rigby by The Beatles",
       "favsongurl": "https://music.amazon.com/albums/B01929I1V4?trackAsin=B01929I4IO&ref=dm_sh_c822-77ff-dmcp-a374-b0653&musicTerritory=US&marketplaceId=ATVPDKIKX0DER",
       "lastUsedTime": "",
       "emailaddress": "wsaxe@amazon.com",
       "favsongcomment": ""
    }
 };

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};