import React from "react";

const MemberMessage = ({ createdDate }) => {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    // For Member Since Message
    const createdDateTimestamp = new Date(createdDate).getTime();
    const currentDate = Date.now();
    const timeDifferenceCreated = currentDate - createdDateTimestamp;
    const daysCreated = Math.floor(timeDifferenceCreated / (1000 * 60 * 60 * 24));
    const creationDate = new Date(createdDate);
    const yearCreated = creationDate.getFullYear();
    const monthCreated = monthNames[creationDate.getMonth()];
    const dayCreated = creationDate.getDate();
    const dateSuffixCreated = getDateSuffix(dayCreated);

    function getDateSuffix(day) {
        return day % 10 === 1 && day !== 11
            ? "st"
            : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    }

    return (
        <p>
            We are really happy that you are a member since {monthCreated} {dayCreated}
            {dateSuffixCreated}, {yearCreated}, that's {daysCreated} days! We hope to see you
            forever!
        </p>
    );
};

export default MemberMessage;
