/**
 * Created by victor on 17/03/16.
 */
exports = module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var queueSchema = new Schema({
        type: {type: String, required: true},
        username: {type: String, required: true },
        password: {type: String, required: true },
        host: {type: String, required: true },
        port: {type: Number, required: true },
        tls: {type: Boolean,default:false},
        name: {type: String, required: true},
        email: {type: String, unique: true, atch: [/.+\@.+\..+/, "Please fill a valid email address"]},
        created: {type: Date, default: Date.now},
    });
    mongoose.model('Queue', queueSchema);
}