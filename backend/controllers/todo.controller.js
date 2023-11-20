const express = require('express')
const { StatusCodes } = require('http-status-codes')
const router = express.Router();
const todo = require('../model/todo.model')


function handleError(res, error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error });
}

router.get('/', async (req, res) => {

    try {
        const docs = await todo.find().sort({ position: -1 })
        res.send(docs);
    } catch (error) {
        handleError(res, error);
    }

})

router.post('/', async (req, res) => {
    try {
        const obj = req.body;
        await todo.create(obj)
        const docs = await todo.find().sort({ position: -1 })
        res.send(docs);
    } catch (error) {
        handleError(res, error);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { prePosition, curPosition } = req.body;
        const id = req.params.id
        await todo.findByIdAndUpdate(id, { $set: { position: curPosition } })
        if (prePosition > curPosition) {
            await todo.updateMany({ position: { $lt: prePosition, $gte: curPosition }, _id: { $ne: id } }, { $inc: { position: 1 } })
        } else {
            const desc = await todo.updateMany({ position: { $lte: curPosition, $gt: prePosition }, _id: { $ne: id } }, { $inc: { position: -1 } })
        }
        const docs = await todo.find().sort({ position: -1 })
        res.send(docs);

    } catch (error) {
        handleError(res, error);
    }
})

router.patch('/status/:id', async (req, res) => {
    try {

        const isCompleted = req.body.isCompleted
        await todo.findByIdAndUpdate(req.params.id, { $set: { isCompleted } })

        const docs = await todo.find().sort({ position: -1 })
        res.send(docs);


    } catch (error) {
        handleError(res, error);
    }
})

module.exports = router;

