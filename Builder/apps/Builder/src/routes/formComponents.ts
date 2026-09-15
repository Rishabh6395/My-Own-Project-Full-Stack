import express from 'express';
import db from '@repo/db';
import { authenticate, requireAdmin } from '@repo/auth';

const router = express.Router();

router.post('/builder/createFormComponent', authenticate, async(req, res) =>{
    try {
        const {name, componentDescription, componentType, formId } = req.body;

        const checkForm = await db.query('SELECT * FROM forms WHERE id = $1', [formId]);
        if (checkForm.rows.length === 0) {
            return res.status(404).json({ error: 'Form does not exist.' });
        }

        const newComponent = await db.query(
            "INSERT INTO form_components (name, component_description, component_type, form_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, componentDescription, componentType, formId]
        )
        res.status(201).json({ success: true, data: newComponent.rows[0] });

    } catch (error:any) {
        console.error(error.message);
        res.status(500).send('Server Error, check server logs');        
    }
})


router.get('/builder/component_registry', authenticate, async(req, res) => {
    try {
        const components = await db.query('SELECT * FROM component_registry');
        res.json({ success: true, results: components.rows.length, data: components.rows });
    } catch (error:any) {
        console.error(error.message);
        res.status(500).send('Server Error, check server logs');
    }
})

// PUT /builder/forms/:formId/versions/:versionId
router.put('/builder/forms/:formId/versions/:versionId',  authenticate, async (req, res) =>{
        var {formId} = req.params;
        var {versionId} = req.params;
        var {components} = req.body;

        if (!Array.isArray(components)) {
            return res.status(400).json({ error: 'components must be an array' });
        }

        // basic validation: every component must have a valid type from the registry
        const registryResult = await db.query('SELECT type FROM component_registry WHERE is_active = true')
        if (registryResult.rows.length === 0) {
            return res.status(500).json({ error: 'Failed to validate component types' });
        }   

        var validTypes = registryResult.rows.map((row) =>{
            return row.type;
        });

        for (var i = 0; i < components.length; i++) {
            if (validTypes.indexOf(components[i].type) === -1) {
                return res.status(400).json({ error: 'Invalid component type: ' + components[i].type });
            }
        }

    
        const updateFormVersion = await db.query(
            'UPDATE form_versions SET components = $1, updated_at = NOW() WHERE id = $2 AND form_id = $3 RETURNING *',
            [JSON.stringify(components), versionId, formId],
        )
        res.status(201).json({ success: true, data: updateFormVersion.rows[0], results: components.length });
    }
);



export default router;