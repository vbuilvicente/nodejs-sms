

exports = module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var preciSchema = new Schema({
        country: {type: String, required: true, },
        preci: {type: String, required: true},
        code: {type: Number, index: {unique: true}},

    });

    mongoose.model('Preci', preciSchema);
}