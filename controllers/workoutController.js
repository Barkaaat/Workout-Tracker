const mysql = require('../models/mysql');

async function getPlan (req, res) {
    try {
        const query = `
            select 
                row_number() over(partition by w.user_id order by w.scheduleDate) as number, 
                w.name,
                w.muscle, 
                w.sets, 
                w.reps, 
                w.scheduleDate,
                ifnull(group_concat(c.comment separator ' - '), 'No Comments') as comments
            from workouts w left join comments c
            on c.workout_id = w.id
            where w.user_id = ?
            group by w.name, w.muscle, w.sets, w.reps, w.scheduleDate
        `;
        const workout = await mysql.query(query, [req.user.id]);
        res.status(200).json(!workout[0].length? 'No Workouts':workout[0]);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function addWorkout (req, res) {
    if (!req.body || !req.body.name || !req.body.muscle || !req.body.sets || !req.body.reps || !req.body.scheduleDate) {
        return res.status(400).send("Invalid workout data");
    }

    try {
        const data = [
            req.user.id, 
            req.body.name, 
            req.body.muscle, 
            req.body.sets, 
            req.body.reps, 
            req.body.scheduleDate
        ];

        const findQuery = `
            select * 
            from workouts 
            where 
                user_id = ? and 
                name = ? and 
                muscle = ? and 
                sets = ? and 
                reps = ? and 
                scheduleDate = ?
        `;
        const  flag = await mysql.query(findQuery, data);
        if (flag[0].length) {
            return res.status(409).send('This workout is already exist');
        }

        const query = `
            insert into 
            workouts (user_id, name, muscle, sets, reps, scheduleDate) 
            values (?, ?, ?, ?, ?, ?)
        `;
        await mysql.query(query, data);
        
        res.status(201).send("Workout is added Done");
    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteWorkout (req, res) {
    if (!req.body || !req.body.number || typeof req.body.number != 'number' || req.body.number < 1) {
        return res.status(400).send("Invalid workout data");
    }

    try {
        const idQuery = `
            select id from (
                select 
                    row_number() over(partition by user_id order by scheduleDate) as number, 
                    id
                from workouts
                where user_id = ?
            ) as sub
            where number = ?
        `;
        const [workoutId] = await mysql.query(idQuery, [req.user.id, req.body.number]);
        if (!workoutId[0]) {
            return res.status(404).send('Workout not found');
        }

        const deleteWorkout = await mysql.query(`delete from workouts where id = ${workoutId[0].id}`);
        await mysql.query(`delete from comments where workout_id = ${workoutId[0].id}`);

        res.status(200).send('Workout is deleted');
    } catch (err) {
        res.status(400).json(err);
    }
}

async function addCommentsToWorkout (req, res) {
    if (!req.body || !req.body.number || typeof req.body.number != 'number' || !req.body.comment) {
        return res.status(400).send('Invalid data');
    }

    try {
        const idQuery = `
            select id from (
                select 
                    row_number() over(partition by user_id order by scheduleDate) as number, 
                    id
                from workouts
                where user_id = ?
            ) as sub
            where number = ?
        `;
        const [workoutId] = await mysql.query(idQuery, [req.user.id, req.body.number]);
        if (!workoutId[0]) {
            return res.status(404).send('Workout not found');
        }

        await mysql.query(`insert into comments (workout_id, comment) values (${workoutId[0].id}, ?)`, [req.body.comment]);

        res.status(201).send("Comment is added Done");
    } catch (err) {
        res.status(400).json(err);
    } 
}

module.exports = {
    getPlan,
    addWorkout,
    deleteWorkout,
    addCommentsToWorkout
};