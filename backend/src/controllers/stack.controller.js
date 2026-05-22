const stackModel = require("../models/stack.model")
const cardModel = require("../models/card.model")

async function createStack(req, res) {
    const creator = req.creator
    const { title, author, cover, cards, insightTitle, insightOne } = req.body

    const cardsPayload = Array.isArray(cards) && cards.length > 0
        ? cards
        : insightTitle && insightOne
            ? [{ head: insightTitle, content: insightOne }]
            : []

    if (!cardsPayload.length) {
        return res.status(400).json({
            success: false,
            error: "At least one insight card is required"
        })
    }

    try {


        const stack = await stackModel.create({
            creator: creator._id,
            title: title,
            coverImage: cover
        })

        const createdCards = await Promise.all(
            cardsPayload.map((card, index) =>
                cardModel.create({
                    stackId: stack._id,
                    order: index + 1,
                    head: card.head,
                    content: card.content
                })
            )
        )

        const newStack = await stackModel.findByIdAndUpdate(stack._id, {
            cards: createdCards.map((card) => card._id)
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