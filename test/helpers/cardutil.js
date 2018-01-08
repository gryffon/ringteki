const CardUtil = {
    matchCardByNameAndPack(labelOrName) {
        var name = labelOrName;
        var pack;
        /* In throneteki, they have multiple cards with the same name,
        differentiated by what pack they came from
        */
        var match = labelOrName.match(/^(.*)\s\((.*)\)$/);
        if(match) {
            name = match[1];
            pack = match[2];
        }

        return function(cardData) {
<<<<<<< HEAD
            return (cardData.name === name && (!pack || cardData.pack_code === pack)) ||
                cardData.id === name;
=======
            return (cardData.name === name || cardData.id === name) && (!pack || cardData.pack_code === pack);
>>>>>>> 61246a588223fcda50a5c60ee707f3cfcb292ab8
        };
    }
};

module.exports = CardUtil;
