const express = require('express');
const multer = require('multer');
const db = require('./db');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('images'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Define la carpeta de destino para almacenar las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Define el nombre de archivo
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => { });

// Ruta de ejemplo
app.get('/empresa', (req, res) => {

  db.query('SELECT g.imagen, e.* FROM empresa e inner join galeria g on e.id = g.empresa_id ', (error, results, fields) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } else {
      res.json(results);
    }
  });
});

app.get('/getEmpresa', (req, res) => {

  id = req.query.id;

  db.query("SELECT g.imagen, e.* FROM empresa e inner join galeria g on e.id = g.empresa_id where e.id=" + id, (error, results, fields) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } else {
      res.json(results);
    }
  });
});
app.get('/deleteEmpresa', (req, res) => {

  id = req.query.id;

  db.query("Delete from empresa where id=" + id, (error, results, fields) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } else {
      res.json(results);
    }
  });
});

app.post('/addempresa', (req, res) => {
  const datos = req.body;

  db.query("INSERT INTO card_empresa.empresa (nombre, descripcion, historia, fecha) VALUES('" + datos.nombre + "', '" + datos.descripcion + "', '" + datos.historia + "', '" + datos.fecha + "');", (error, results, fields) => {
    id = results.insertId
    db.query("INSERT INTO card_empresa.galeria (empresa_id, imagen, descripcion) VALUES('" + id + "', '" + datos.imagen + "', '" + datos.descripcion + "');", (error, results, fields) => {
    });
  });

  res.send(datos);
});

app.post('/editempresa', (req, res) => {
  const datos = req.body;
  
  
  db.query("UPDATE card_empresa.empresa SET nombre='"+datos.nombre+"', descripcion='"+datos.descripcion+"', historia='"+datos.historia+"', fecha='"+datos.fecha+"' WHERE id="+datos.id+";", (error, results, fields) => {
    db.query("UPDATE card_empresa.galeria SET descripcion='"+datos.descripcion+"' WHERE empresa_id ="+datos.id+";", (error, results, fields) => {
    });
  });

  res.send(datos);
});

app.get('/galeria', (req, res) => {

  // res.json(req.query.id)
  db.query('SELECT * FROM galeria', (error, results, fields) => {
    if (error) {
      console.error('Error al consultar la base de datos:', error);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } else {
      res.json(results);
    }
  });
});

// Escucha en el puerto especificado
app.listen(port, () => {
  console.log(`La aplicación está escuchando en http://localhost:${port}`);
});