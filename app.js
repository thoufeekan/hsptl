const path = require('path');
const express = require('express');
const app = express();

// EmployeeData Model 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  name: String,
  location: String,
  position: String,
  salary: Number,
}, { versionKey: false });

const employeeData = mongoose.model('employees', employeeSchema);

//Express Middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, '/dist/FrontEnd')));

// Task2: create mongoDB connection
mongoose.connect("mongodb+srv://thoufeekthoufeek599:zpDfA0pwlGcAhIYX@cluster0.re0buqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });

// Task 2: write api with error handling and appropriate api mentioned in the TODO below

// TODO: get data from db using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await employeeData.find();
        res.json(employees);
    } catch (error) {
        console.error('Error retrieving employee list:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// TODO: get single data from db using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    const employeeId = req.params.id;
    try {
        const employee = await employeeData.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Error retrieving employee data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// TODO: send data from db using api '/api/employeelist'
// Request body format: {name:'', location:'', position:'', salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;

        // Validating the required fields
        if (!name || !location || !position || !salary) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newEmployee = new employeeData({
            name,
            location,
            position,
            salary
        });
        await newEmployee.save();
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error inserting employee data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// TODO: Update an employee data from db by using api '/api/employeelist'
// Request body format: {name:'', location:'', position:'', salary:''}
app.put('/api/employeelist', async (req, res) => {
    const employeeId = req.body._id; 
    try {
        const employee = await employeeData.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        employee.name = req.body.name || employee.name;
        employee.location = req.body.location || employee.location;
        employee.position = req.body.position || employee.position;
        employee.salary = req.body.salary || employee.salary;

        await employee.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating employee data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// TODO: delete an employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        const result = await employeeData.deleteOne({ _id: employeeId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting employee data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Don't delete this code. It connects the frontend file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/Frontend/index.html'));
});

// Task1: initiate app and run server at 3000
app.listen(3000, () => {
    console.log('Server is Running on PORT 3000');
});
