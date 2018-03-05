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
    
    'startTheMeeting': function () {
        this.attributes.speechOutput = "start the meeting has not been implemented yet";
        this.emit(':tell', this.attributes.speechOutput);
    },
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
    'tellMeAbout': function () {
        if (this.event.request.dialogState !== 'COMPLETED'){
            // delegating to alexa dialog model if the state is not complete
            this.emit(':delegate');
        } else {
            this.attributes.speechOutput = "tell me about has not been implemented yet";
            this.emit(':tell', this.attributes.speechOutput);
        }
    },
    'attribForAttendee': function () {
        if (this.event.request.dialogState !== 'COMPLETED'){
            // delegating to alexa dialog model if the state is not complete
            this.emit(':delegate');
        } else {
            this.attributes.speechOutput = "atribute for attendee has not been implemented yet";
            this.emit(':tell', this.attributes.speechOutput);
        }
    },
    'shuffleTeamPlaylist': function () {
        this.attributes.speechOutput = "shuffle playlist has not been implemented ye";
        this.emit(':tell', this.attributes.speechOutput);
    },
    'playAttendeeSong': function () {
        this.attributes.speechOutput = "play attendee song has not been implemented ye";
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
    'askLNFRandomP': function () {
        if (this.event.request.dialogState !== 'COMPLETED'){
            // delegating to alexa dialog model if the state is not complete
            this.emit(':delegate');
        } else {
            this.attributes.speechOutput = "atribute for ask LNF has not been implemented yet";
            this.emit(':tell', this.attributes.speechOutput);
        }
    },
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
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
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
    'en-GB': {
        translation: {
            RECIPES: recipes.RECIPE_EN_GB,
            SKILL_NAME: 'British Minecraft Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question such as, what\'s the recipe for a chest? ... Now, what can I help you with?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things such as, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            SKILL_NAME: 'American Minecraft Helper',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the recipe for a chest? ... Now, what can I help you with?",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - Recipe for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the recipe, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the recipe, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
            RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the recipe for %s. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that recipe. ',
            RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'de-DE': {
        translation: {
            RECIPES: recipes.RECIPE_DE_DE,
            SKILL_NAME: 'Assistent für Minecraft in Deutsch',
            WELCOME_MESSAGE: 'Willkommen bei %s. Du kannst beispielsweise die Frage stellen: Welche Rezepte gibt es für eine Truhe? ... Nun, womit kann ich dir helfen?',
            WELCOME_REPROMT: 'Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.',
            DISPLAY_CARD_TITLE: '%s - Rezept für %s.',
            HELP_MESSAGE: 'Du kannst beispielsweise Fragen stellen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
            HELP_REPROMT: 'Du kannst beispielsweise Sachen sagen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?',
            STOP_MESSAGE: 'Auf Wiedersehen!',
            RECIPE_REPEAT_MESSAGE: 'Sage einfach „Wiederholen“.',
            RECIPE_NOT_FOUND_MESSAGE: 'Tut mir leid, ich kenne derzeit ',
            RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'das Rezept für %s nicht. ',
            RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'dieses Rezept nicht. ',
            RECIPE_NOT_FOUND_REPROMPT: 'Womit kann ich dir sonst helfen?',
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