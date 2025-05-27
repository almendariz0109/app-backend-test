const pendingOrderRepository = require('../repositories/pending.purch.orders.repository');

const getPendingOrders = async() => {
    const data = await pendingOrderRepository.queryPendingOrders();
    return data;
};

module.exports = {getPendingOrders};