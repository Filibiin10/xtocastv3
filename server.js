import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import userRoutes from './route/userRoutes.js';
import eventRoutes from './route/eventRoutes.js';
import categoryRoutes from './route/categoryRoutes.js';
import nomineeRoutes from './route/nomineeRoutes.js';
import transactionRoutes from './route/transactionRoutes.js';
import voteRoutes from './route/voteRoutes.js';
import { testConnection } from './db/db.js';
import { getTodaysRevenue, getTotalAmountPaid, getWeeklyRevenue } from './controllers/voteController.js';
import { fileURLToPath } from 'url';
import multer from 'multer';
import {createEvent} from './controllers/eventController.js';
import { getAllCategoriesByEventId, getCategoryByEventId } from './controllers/categoryController.js';
import { getNomineesByCategoryId } from './controllers/nomineeController.js';


dotenv.config();

const app = express();
const PORT = 7000;
app.use(bodyParser.json({ limit: '10mb' })); // Set limit to 10MB, adjust as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({ origin: '*', credentials: true, 
    methods:  ['GET', 'POST', 'PUT', 'DELETE']
 }));

// app.use(cors())
app.use(express.json());

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        // Use a unique filename to avoid collisions
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.post('/uploads', upload.single('image'), (req, res) => {
    console.log(req.file)
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`; // Create the full URL for the uploaded image
    res.json({
        message: 'File uploaded successfully!',
        image: imageUrl // Return the full URL
    });
});


// Routes

app.post('/upload', upload.single('image'),createEvent)


app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/nominees', nomineeRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/votes', voteRoutes);
app.get('/api/amount-paid', getTotalAmountPaid);
app.get('/api/todays-revenue', getTodaysRevenue);
app.get('/api/weekly-revenue', getWeeklyRevenue);

app.get('/api/eventid/:id', getCategoryByEventId);
app.get('/api/nominee/:id', getNomineesByCategoryId);
app.get('/api/category/:id', getAllCategoriesByEventId);


testConnection();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

