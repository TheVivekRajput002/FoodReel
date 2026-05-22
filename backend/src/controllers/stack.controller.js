const stackModel = require("../models/stack.model")
const cardModel = require("../models/card.model")

async function createStack(req, res) {
    const creator = req.creator
    const { title, author, cover, insightTitle, insightOne } = req.body

    try {


        const stack = await stackModel.create({
            creator: creator._id,
            title: title,
            coverImage: cover
        })

        const card = await cardModel.create({
            stackId: stack._id,
            order: 1,
            head: insightTitle,
            content: insightOne
        })

        const newStack = await stackModel.findByIdAndUpdate(stack._id, {
            cards: [card._id]
        }, { new: true })

        res.status(201).json({
            success: true,
            stack: newStack
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })

    }
}

async function getStacks(req, res) {

    try {
        const stack = await stackModel.find().populate("creator")
        res.status(200).json({
            success: true,
            stack: stack
        })

    } catch (error) {

        res.status(400).json({
            success: false
        })
    }
}

async function getStackDetail(req, res) {

    const stackId = req.params.id
    try {
        const stackDetail = await stackModel.findById(stackId).populate("cards")

        res.status(200).json({
            success: true,
            stackDetail: stackDetail
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error
        })

    }
}

module.exports = {
    createStack,
    getStacks,
    getStackDetail
}