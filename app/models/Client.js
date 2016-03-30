/**
 * Created by victor on 17/03/16.
 */
exports = module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var clientSchema = new Schema({
        name: {type: String},
        phone: {type: Number},
        credit: {type: Number},
        valid: {type: Boolean, default: true},
        countFree: {type: Number,default:3},
        email: {type: String, unique: true, atch: [/.+\@.+\..+/, "Please fill a valid email address"]},
        created: {type: Date, default: Date.now},
    });


     mongoose.model('Client', clientSchema);
}