module.exports = {
    temperature: function (temp) {
        var text;

        if (temp > 80) {
            text = "Your coffee is way to hot. Blow before drinking!";
        }

        if (temp >= 60 && temp <= 80) {
            text = "Your coffee is perfect to drink.";
        }

        if (temp < 60) {
            text = "Your coffee becomes Iced Coffee.";
        }

        return ":coffee: " + text;
    }
};
