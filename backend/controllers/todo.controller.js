const express = require('express')
const { StatusCodes } = require('http-status-codes')
const router = express.Router();
const todo = require('../model/todo.model')


function handleError(res, error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
}

router.get('/', async (req, res) => {

    try {
        const docs = await todo.find().sort({ position: 1 })
        res.send(docs);
    } catch (error) {
        handleError(res, error);
    }

})

router.post('/', async (req, res) => {
    try {
        const obj = req.body;
        const doc = await todo.create(obj)
        res.status(StatusCodes.CREATED).send(doc);
    } catch (error) {
        handleError(res, error);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { prePosition, curPosition } = req.body;
        const id = req.params.id
        const shift = await todo.findByIdAndUpdate(id, { $set: { position: curPosition } })
        if (prePosition > curPosition) {
            const incre = await todo.updateMany({ position: { $lt: prePosition, $gte: curPosition }, _id: { $ne: id } }, { $inc: { position: 1 } })
            res.send({ shift, incre })
        } else {
            const desc = await todo.updateMany({ position: { $lte: curPosition, $gt: prePosition }, _id: { $ne: id } }, { $inc: { position: -1 } })

            res.send({ shift, desc })
        }
    } catch (error) {
        handleError(res, error);
    }
})

router.patch('/status/:id', async (req, res) => {
    try {

        const isCompleted = req.body.isCompleted
        doc = await todo.findByIdAndUpdate(req.params.id, { $set: { isCompleted } })
        res.send(doc)

    } catch (error) {
        handleError(res, error);
    }
})

module.exports = router;

