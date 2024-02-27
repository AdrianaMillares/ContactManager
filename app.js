/**
 * Express application to manage contacts using HubSpot API.
 * @module app
 */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const accessToken = process.env.HUBSPOT_API_KEY;
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static('styles'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Search for a contact by email using the HubSpot API.
 * @async
 * @param {string} email - Email address of the contact to search for.
 * @returns {Promise<Object>} - Promise representing the search result.
 * @throws {Error} - If an error occurs during the search process.
 */
async function searchContactByEmail(email) {
    try {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const searchRequest = {
            filterGroups: [
                {
                    filters: [
                        {
                            propertyName: 'email',
                            operator: 'EQ',
                            value: email
                        }
                    ]
                }
            ]
        };

        const response = await axios.post('https://api.hubspot.com/crm/v3/objects/contacts/search', searchRequest, {
            headers: headers
        });

        return response.data;
    } catch (error) {
        console.error('Error al buscar el contacto:', error);
        throw error;
    }
}

/**
 * Route to render the home page with contacts data.
 */
app.get('/', async (req, res) => {
    try {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.get('https://api.hubapi.com/contacts/v1/lists/all/contacts/all', {
            headers: headers
        });

        const results = response.data.contacts;
        console.log(results[5]['identity-profiles'][0]['identities']);
        res.render('home', { results: results });
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * Route to handle the creation of a new contact.
 */
app.post('/', async (req, res) => {
    try {
        const { name, lastName, email, phone } = req.body;
        if (!name || !lastName || !email || !phone) {
            return res.status(400).send('Todos los campos son requeridos');
        }

        const existingContact = await searchContactByEmail(email);

        if (existingContact.total > 0) {
            console.log('El contacto ya existe:', existingContact.results[0]);
            return res.status(409).send('El contacto ya existe');
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const contactObj = {
            properties: {
                firstname: name,
                lastname: lastName,
                email: email,
                phone: phone
            },
        };

        const createContactResponse = await axios.post('https://api.hubspot.com/crm/v3/objects/contacts', contactObj, {
            headers: headers
        });

        console.log('Contacto creado exitosamente en HubSpot.');
        res.status(201).send('Contacto creado exitosamente en HubSpot.');
    } catch (error) {
        console.error('Error al crear el contacto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

/**
 * Route to search for a contact by email.
 */
app.post('/search', async (req, res) => {
    try {
        const { email } = req.body;
        const contact = await searchContactByEmail(email);
        console.log(contact.results[0]);
        if (contact.total > 0) {
            const data = {
                name: contact.results[0].properties.firstname,
                lastName: contact.results[0].properties.lastname,
                email: contact.results[0].properties.email,
            };
            res.json({ success: true, data });
        } else {
            res.status(404).json({ success: false, message: 'Contacto no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar el contacto:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

/**
 * Start the server and listen on the specified port.
 */
app.listen(PORT, () => {
    console.log(`El servidor se está ejecutando en el puerto ${PORT}`);
});
