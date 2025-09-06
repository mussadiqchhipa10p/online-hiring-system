// User and Auth Types
export var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["EMPLOYER"] = "EMPLOYER";
    Role["CANDIDATE"] = "CANDIDATE";
})(Role || (Role = {}));
// Job Types
export var JobStatus;
(function (JobStatus) {
    JobStatus["DRAFT"] = "DRAFT";
    JobStatus["PUBLISHED"] = "PUBLISHED";
    JobStatus["CLOSED"] = "CLOSED";
})(JobStatus || (JobStatus = {}));
// Application Types
export var AppStatus;
(function (AppStatus) {
    AppStatus["PENDING"] = "PENDING";
    AppStatus["REVIEW"] = "REVIEW";
    AppStatus["INTERVIEW_SCHEDULED"] = "INTERVIEW_SCHEDULED";
    AppStatus["REJECTED"] = "REJECTED";
    AppStatus["HIRED"] = "HIRED";
})(AppStatus || (AppStatus = {}));
//# sourceMappingURL=index.js.map