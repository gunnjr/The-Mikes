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
        // see if name was provided
        if  (!(attendeeSlot && attendeeSlot.value)) {
            // name not provided, ask for it
            this.emit(':elicitSlot', 'attendee');
        } else {
            //we have name, so continue 

            // get info on person and build reponse.
            // get alias from slot
            let subjectAlias = "johngunn";
            // get name
            let subjectName = "John Gunn";
            let objPronoun = "his";
            let pronoun = "he";
            let subjectHometown = "Atlanta, GA";
            let college = "Georgia Tech"
            let subjectFavTune = "Semi-charmed Life by Third Eye Blind";
            let subjectLNF = "In college, I went on a blind date to the UVA Kappa Christmas formal with the granddaughter of Lydon Baines Johnson.  The next morning I woke up on her floor wrapped in an old blanket that was with the name Sissy Byrd written on it. I never saw her again.";

            this.attributes.speechOutput = this.t('COMPLETE_INFO', subjectName, subjectHometown, pronoun, college, objPronoun, subjectFavTune );
            this.attributes.speechOutput += " Do you want to know a little known fact about " + subjectName + "?";
            
            // delegating to alexa dialog model if the state is not complete  TODO: change to elicit LNF
            this.emit(':tell', this.attributes.speechOutput);
        }
    },
    'tellHowYouWork': function () { // tells what it can do
        this.attributes.speechOutput = this.t('HOWWORK_MESSAGE');
        this.emit(':tell', this.attributes.speechOutput, this.attributes.repromptSpeech);
    }, 
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
            SKILL_NAME: 'Mikey Vee',
            WELCOME_MESSAGE: "Hello and welcome to Nashville!  I\'m virtual Mike.  Call me Mikey Vee.  I\'ll be your meeting companion for the next two days.  My goal is to help you learn some things about your teammates that you might not know.  Hopefully I can also help break up the day and interject some levity.  You have a packed agenda (and a small room with no windows, so thanks for that John).  If you want to talk to me, just tell Alexa to ask Mikey Vee to do something.  If you want to know more, ask me for help",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            HELP_MESSAGE: "I can tell you about someone or see if you can guess someone based on their little known fact.  Just say for example, alexa, ask Mikey Vee to tell me about Mike Smith.  Or you can say, alexa, ask Mikey Vee for a little known fact",
            COMPLETE_INFO: "%s is from %s., %s went to %s., %s favorite song is %s.",
            LNF_INFO: "Here is a little known fact about %s",
            HOWWORK_MESSAGE: "It's pretty simple really.  My dialog model which defines what you say and how i respond is defined on developer.amazon.com.  A single lambda function on AWS has all of my logic.  Information about the team is held in a dynamo DB.  I pull information from a table in Dyanmo DB to get the information that I share with you.",
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

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};