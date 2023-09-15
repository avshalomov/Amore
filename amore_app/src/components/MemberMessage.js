import React from "react";

const MemberMessage = ({ lastDate, createdDate }) => {
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

    // For Last Login Message
    const lastLoginDateTimestamp = new Date(lastDate).getTime();
    const timeDifferenceLastLogin = currentDate - lastLoginDateTimestamp;
    const hoursLastLogin = Math.floor(timeDifferenceLastLogin / (1000 * 60 * 60));
    const daysLastLogin = Math.floor(timeDifferenceLastLogin / (1000 * 60 * 60 * 24));
    const lastLoginDate = new Date(lastDate);
    const yearLastLogin = lastLoginDate.getFullYear();
    const monthLastLogin = monthNames[lastLoginDate.getMonth()];
    const dayLastLogin = lastLoginDate.getDate();
    const dateSuffixLastLogin = getDateSuffix(dayLastLogin);

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
        <>
            <p>
                We are really happy that you are a member since {monthCreated} {dayCreated}
                {dateSuffixCreated}, {yearCreated}, that's {daysCreated} days! We hope to see you
                forever!
            </p>
            {hoursLastLogin < 24 ? (
                <p>It's been {hoursLastLogin} hours since you last logged in.</p>
            ) : (
                <p>
                    It's been {daysLastLogin} days since you last logged in on {monthLastLogin} {dayLastLogin}
                    {dateSuffixLastLogin}, {yearLastLogin}
                </p>
            )}
        </>
    );
};

export default MemberMessage;
