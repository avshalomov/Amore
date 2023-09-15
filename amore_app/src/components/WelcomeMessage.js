import React from "react";

const WelcomeMessage = ({ user }) => {
    const welcomeMessage = {
        msg1: `Hey there ${user}, let's get fabulous!`,
        msg2: `Welcome back to Amore, ${user}, the fashion haven!`,
        msg3: `Long time no see ${user}, we've missed your style!`,
        msg4: `Ready to fill up your cart with awesomeness, ${user}?`,
        msg5: `Your wardrobe called, ${user}. It misses you!`,
        msg6: `Fashion-forward as always, ${user}, we salute you!`,
        msg7: `Setting trends again, we see, ${user}!`,
        msg8: `Look who's back, ${user}, the fashionista!`,
        msg9: `Ready for another spree, ${user}? Your cart's waiting!`,
        msg10: `Shopping made better with you, ${user}, truly!`,
        msg11: `Strut your stuff, ${user}, and make fashion history!`,
        msg12: `You're back, ${user}! Let's create some head-turning looks!`,
        msg13: `Time for a style refresh, wouldn't you say, ${user}?`,
        msg14: `Ah, our favorite trendsetter, ${user}, has returned!`,
        msg15: `You, ${user}, make fashion look easy. Let's go!`,
        msg16: `Fashion's finest, ${user}, are you ready to shop?`,
        msg17: `Get ready, ${user}, to be the life of the wardrobe party!`,
        msg18: `Back for more, ${user}? We're thrilled!`,
        msg19: `Need a style boost, ${user}? You've come to the right place!`,
        msg20: `Get set to wow the crowd, ${user}! Let's shop!`,
    };

    const messageKeys = Object.keys(welcomeMessage);
    const randomKey =
        messageKeys[Math.floor(Math.random() * messageKeys.length)];
    const message = welcomeMessage[randomKey];

    return <h3>{message}</h3>;
};

export default WelcomeMessage;
