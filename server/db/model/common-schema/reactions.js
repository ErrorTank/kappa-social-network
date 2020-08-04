const SingleReactionSchema = {
    type: [
        {
            type: ObjectId,
        },

    ],
    default: []
}

const ReactionSchema = {
    love: SingleReactionSchema,
    laugh: SingleReactionSchema,
    wow: SingleReactionSchema,
    cry: SingleReactionSchema,
    angry: SingleReactionSchema,
    thump_up: SingleReactionSchema,
    thump_down: SingleReactionSchema
}

module.exports = {
    ReactionSchema,
    SingleReactionSchema
}