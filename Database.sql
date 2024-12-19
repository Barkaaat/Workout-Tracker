create table users (
    id int primary key auto_increment,
    username varchar(30) not null unique,
    password nvarchar(100) not null
);

create table blackList (
    token nvarchar(200) distinct
);

create table workouts (
    id int primary key auto_increment,
    user_id int,
    name varchar(100),
    muscle varchar(100),
    sets int,
    reps int,
    scheduleDate datetime
);

create table comments (
    id int primary key auto_increment,
    workout_id int,
    comment nvarchar(300)
);