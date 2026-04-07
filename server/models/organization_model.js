const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema({
    organization_name: {
        type: String,
        required: true
    },
    organization_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organization_members: {
        type: Number,
        default: 0
    }
});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;