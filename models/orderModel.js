const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [],
    qrcode: String,
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: { type: String, default: 'pending' },
    payment_status: { type: String, required: true, default: 'unpaid' },
    paymentintentid: { type: String },
    customerid: { type: String },
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Order", orderSchema);


