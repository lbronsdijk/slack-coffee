module.exports = {
    temperature: function (temp) {
        var text;

        if (temp > 80) {
            text = "Your coffee is way to hot. Blow before drinking! Or wait for my cue.";
        }

        if (temp >= 60 && temp <= 80) {
            text = "Your coffee is perfect to drink.";
        }

        if (temp < 60) {
            text = "Your coffee becomes Iced Coffee. You should finish it.";
        }

        if (temp < 40) {
            text = "Your coffee has been declared dead. Make a new one.";
        }

        return ":coffee: " + text;
    }
};
