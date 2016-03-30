/**
 * Created by victor on 17/03/16.
 */
exports = module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var requestSchema = new Schema({
        created: {type: Date, default: Date.now},
        type: {type: String},
        credit:{type:Number},
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        }
    });

    mongoose.model('RequestSmS', requestSchema);
}