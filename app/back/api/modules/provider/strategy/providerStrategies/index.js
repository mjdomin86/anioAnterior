// As with all strategy registries, order matters. Once we find a strategy to use,
// we will not keep looking for more strategies. For this reason, I put the test
// strategy first and the default strategy last.

module.exports = {
   mercadoPagoProviderStrategy: require('./mercadoPagoProviderStrategy'),
   marketBBVAProviderStrategy: require('./marketBBVAProviderStrategy')
 };