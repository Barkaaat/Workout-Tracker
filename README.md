# Workout Tracker

Solution for the [Workout Tracker](https://roadmap.sh/projects/fitness-workout-tracker) challenge from [roadmap.sh](https://roadmap.sh/).

Workout Tracker built with **Node.js**, **Express**, and **MySql**. This project allows you to create account, add workouts with detels, add comments to your workouts, and delete workouts.

## Features
- **Create account**: Register new account with username and password.
- **Login and Logout**: With registration username and password.
- **Add workout**: Use login token to add new workout.
- **Add comments to selected workout**: You can add some comments to your workouts.
- **List workouts**: Show your workouts with comments you have added.
- **Delete workout**: Remove workout from your workouts list.

## Prerequisites
- **Node.js**
- **npm**
- **MySql**

## Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Barkaaat/Workout-Tracker.git
   cd Workout-Tracker
   ```

2. Install the required dependencies:
   ```bash
   npm i
   ```

3. Ensure the `.env` file exists and contains your MySql connection data.
   

4. Start the server:
   ```bash
   npm start
   ```

---

## API Endpoints

1. **POST** `/auth/register`  
  - Request Body:    
   `{ "username": "barakat", "password": "barakat123" }`.

2. **POST** `/auth/login`  
  - Request Body:    
   `{ "username": "barakat", "password": "barakat123" }`    
  - Get Response:    
   `{ "message": "login successful", "token": token }`.

3. **POST** `/workout/add`    
  - Headers authrization:  
   `Bearer token`
  - Request Body:    
   `{ "name": workout name, "muscle": muscle, "sets": sets num, "reps": reps num, "scheduleDate": scheduled date }`.

4. **POST** `/workout/addComment`    
  - Headers authrization:  
   `Bearer token`    
  - Request Body:  
   `{ "number": workout number, "comment": comment }`

5. **DELETE** `/workout/delete`    
  - Headers authrization:  
   `Bearer token`   
  - Request Body:  
   `{ "number": workout number }`

6. **POST** `/auth/logout`
  - Headers authrization:  
   `Bearer token`
