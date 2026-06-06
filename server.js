const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'data');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, 'ubicacion.xlsx'); // siempre sobrescribe el archivo actual
    }
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.originalname.endsWith('.xlsx')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos .xlsx'), false);
    }
}});

// Rutas de la API

// Endpoint para crear un archivo Excel nuevo con datos de ejemplo
app.post('/api/create-new-excel', (req, res) => {
    const excelPath = path.join(__dirname, 'data', 'ubicacion.xlsx');
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const datosEjemplo = [
        { "Nombre Cliente": "Cliente Ejemplo 1", "Visita al Cliente": "", "Ubicacion": "" },
        { "Nombre Cliente": "Cliente Ejemplo 2", "Visita al Cliente": "", "Ubicacion": "" },
        { "Nombre Cliente": "Cliente Ejemplo 3", "Visita al Cliente": "", "Ubicacion": "" }
    ];
    const hoja = XLSX.utils.json_to_sheet(datosEjemplo);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Clientes');
    XLSX.writeFile(libro, excelPath);
    res.json({ success: true, message: 'Archivo nuevo creado correctamente' });
});

// Endpoint para subir un archivo Excel proporcionado por el usuario
app.post('/api/upload-excel', upload.single('excelFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
    }
    // Validar que el archivo tenga las columnas requeridas (opcional)
    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (data.length === 0) {
            // Si está vacío, se puede permitir, pero al menos debe tener las columnas
            // Opcional: agregar columnas si faltan
        }
        res.json({ success: true, message: 'Archivo cargado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'El archivo no es válido o está corrupto' });
    }
});

// Obtener lista de clientes desde el Excel actual
app.get('/api/clientes', (req, res) => {
    const excelPath = path.join(__dirname, 'data', 'ubicacion.xlsx');
    if (!fs.existsSync(excelPath)) {
        return res.status(404).json({ success: false, message: 'No hay archivo Excel. Cree o cargue uno primero.' });
    }
    try {
        const libro = XLSX.readFile(excelPath);
        const hoja = libro.Sheets[libro.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja);
        const nombres = datos.map(row => row["Nombre Cliente"]).filter(n => n);
        res.json({ success: true, clientes: nombres });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al leer el archivo' });
    }
});

// Guardar visita y ubicación
app.post('/api/guardar', (req, res) => {
    const { cliente, tipoVisita, ubicacion } = req.body;
    const excelPath = path.join(__dirname, 'data', 'ubicacion.xlsx');

    if (!fs.existsSync(excelPath)) {
        return res.status(404).json({ success: false, message: 'No hay archivo Excel. Cree o cargue uno primero.' });
    }

    if (!cliente || !tipoVisita || !ubicacion) {
        return res.status(400).json({ success: false, message: 'Faltan datos' });
    }

    try {
        const libro = XLSX.readFile(excelPath);
        const hoja = libro.Sheets[libro.SheetNames[0]];
        let datos = XLSX.utils.sheet_to_json(hoja);

        let encontrado = false;
        datos = datos.map(row => {
            if (row["Nombre Cliente"] === cliente) {
                encontrado = true;
                return { ...row, "Visita al Cliente": tipoVisita, "Ubicacion": ubicacion };
            }
            return row;
        });

        if (!encontrado) {
            datos.push({
                "Nombre Cliente": cliente,
                "Visita al Cliente": tipoVisita,
                "Ubicacion": ubicacion
            });
        }

        const nuevaHoja = XLSX.utils.json_to_sheet(datos);
        libro.Sheets[libro.SheetNames[0]] = nuevaHoja;
        XLSX.writeFile(libro, excelPath);
        res.json({ success: true, message: `Datos guardados para ${cliente}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al guardar' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});