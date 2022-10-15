import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice 
    } = req.body
    

    if(orderItems && orderItems.length === 0 ) {
        res.status(400)
        throw new Error('No order items')
        return
    } else {
        const order = new Order({
        orderItems, 
        user: req.user._id,
        shippingAddress, 
        paymentMethod, 
        itemPrice, 
        taxPrice,
        shippingPrice, 
        totalPrice 
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
  })

// @desc    GET order by ID
// @route   GET /api/orders/:id
// @access  Private

export const getOrderById = asyncHandler(async (req, res) => {
   const order = await Order.findById(req.params.id).populate('user', 'name email')

   if(order) {
    res.json(order)
   } else {
    res.status(404)
    throw new Error('Order not found')
   }
  })
// @desc    GET update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private

export const updateOrderToPaid = asyncHandler(async (req, res) => {

    const {id, reference} = req.body
   const order = await Order.findById(id)

   if(order){
    const update = await Order.findByIdAndUpdate(id, {
        paystackReference: reference,
        isPaid: true,
        paidAt: new Date()
    })

    await update.save()

    if(update) {
        res.json(update)
    } else{
        res.status(404)
    throw new Error('Sorry Something Went Wrong')
    }
   } else{
    res.status(404)
    throw new Error('Order not found')
   }

  
  })


