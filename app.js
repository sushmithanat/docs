const express = require('express')
const app = express()
const fs = require('fs').promises;
const bodyParser = require('body-parser')
const path = require('path');
const { writeFile } = require('fs');
const port = 3000;

const filePath = path.join('data.json');
app.use(bodyParser.json());

app.post('/addContact', async (req, res) => {
    try{
        let newData = req.body;
        
        const fileData = await readFile();

        const fname = newData.firstName;
        const lname = newData.lastName;
        const Cnumber = newData.PhoneNumber;
        const type = newData.contactType;
        fileData.forEach((contactObj) => {
            if(contactObj.lastName === lname && contactObj.PhoneNumber === Cnumber)
            {
                return res.json({message: "Contact already exists", newData});
            }
        });
        
        if(fname && lname && Cnumber)
        {
            fileData.push(newData);

            await fs.writeFile(filePath, JSON.stringify(fileData), 'utf8');

            res.status(200).json({message: "Added data successfully"})
        }

        else{
            res.status(400).json({message: "one of the fields missing: firstName, lastName, PhoneNumber"})
        }
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
})

async function readFile() {
    try{
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    }
    catch(error){
        return [];
    }
}

app.get('/', async (req,res) => {
    // res.send('Hello World!')
    const params = req.query;
    const filePath = "data.json";

    try{
        const fileData = await readFile();
        if(Object.keys(fileData).length === 0)
            res.json({message: "No contacts found.."});
        res.json({fileData});
    }

    catch(error){
        console.log('Error reading JSON request: ', error);
        res.status(404).json({error: "Data not found"});
    }
});

app.get('/getContact', async (req,res) => {
    // res.send('Hello World!')
    const params = req.query;
    const arrayData = [];
    const filePath = "data.json";

    const fname = req.query.firstName;
    const lname = req.query.lastName;

    if(fname && lname){
        console.log(fname);
        console.log(lname);
        try{
            const fileData = await readFile();
            // console.log(fileData);
            let found = false;
            fileData.forEach((contactObj) => {
                // console.log(contactObj.firstName);
                // console.log(contactObj.lastName);
                if(contactObj.firstName == fname && contactObj.lastName == lname)
                {
                    found = true;
                    res.json({firstName: fname, lastName: lname, "PhoneNumber" : contactObj.PhoneNumber});
                }
            });

            if(found === false){
                res.json({message: "No contact found with follwing details", fname, lname})
            }
            // arrayData = JSON.parse(content);
        }
        catch(error){
            console.log('Error reading JSON request: ', error)
        }
    }

    else{
        return res.status(400).json({error: "Bad request"});
    }
    
    // console.log(arrayData);
});

app.get('/getContactByCell', async (req,res) => {
    // res.send('Hello World!')
    const params = req.query;
    const filePath = "data.json";
    const Cnumber = req.query.PhoneNumber;

    if(Cnumber)
    {
        try{
            const fileData = await readFile();
            // console.log(fileData);
            let found = false;
            fileData.forEach((contactObj) => {
                console.log(contactObj.PhoneNumber);
                if(contactObj.PhoneNumber === Cnumber)
                {
                    found = true;
                    res.json({message: "Contact Details", contactObj});
                }
            });

            if(found === false){
                res.json({message: "No contact found with follwing details", fname, lname})
            }
            // arrayData = JSON.parse(content);
        }
        catch(error){
            console.log('Error reading JSON request: ', error)
        }
    }
});

app.delete('/deleteContact', async (req, res) => {
    try{
        let newData = req.body;
        
        const fileData = await readFile();
        const remainingData = [];

        const fname = newData.firstName;
        const lname = newData.lastName;
        const Cnumber = newData.PhoneNumber;
        const type = newData.contactType;
        let found = false;
        fileData.forEach((contactObj) => {
            if(contactObj.firstName === fname && contactObj.lastName === lname && contactObj.PhoneNumber === Cnumber)
            {
                found=true;
                // return res.json({message: "Contact already exists", newData});
            }
            else{
                remainingData.push(contactObj);
            }
        });
        
        if(found === true)
        {
            // fileData.push(remainingData);

            await fs.writeFile(filePath, JSON.stringify(remainingData), 'utf8');

            res.status(200).json({message: "deleted data successfully"})
        }

        else{
            res.status(400).json({message: "contact doesn't exists"})
        }
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Error while deleting the data"});
    }
})

async function readFile() {
    try{
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    }
    catch(error){
        return [];
    }
}
// app.post('/getContact',async (req, res) => {
//     const data = req.body;
//     const filePath = "data.json";
//     const arrayData = [];

//     const fileData = await 

//     arrayData.push(data);
//     const jsonData = JSON.stringify(arrayData);

//     fs.appendFile(filePath, jsonData, (err) => {
//         if(err){
//             console.error("Error writting data to JSOn file: ", err);
//             return res.status(500).json({error: "Internal server error"});
//         }

//         res.json({message: 'contact saved successfully'})
//     })
// })

app.listen(port, () => {
    console.log("Example app listening at port")
})