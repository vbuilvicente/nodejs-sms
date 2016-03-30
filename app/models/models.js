/**
 * Created by victor on 17/03/16.
 */
'use strict';

exports = module.exports = function( mongoose) {
    //embeddable docs first
    require('./User')( mongoose);
    require('./Client')( mongoose);
    require('./RequestSMS')( mongoose);
    require('./Queue')( mongoose);
    require('./Preci')( mongoose);

};