//
//  PXPaymentConfiguration.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 10/8/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

internal typealias PXPaymentConfigurationType = (chargeRules: [PXPaymentTypeChargeRule]?, paymentPlugin: PXSplitPaymentProcessor)

/**
 Any configuration related to the Payment. You can set you own `PXPaymentProcessor`. Configuration of discounts, charges and custom Payment Method Plugin.
 */
@objcMembers
open class PXPaymentConfiguration: NSObject {
    private let splitPaymentProcessor: PXSplitPaymentProcessor
    private var chargeRules: [PXPaymentTypeChargeRule] = [PXPaymentTypeChargeRule]()
    private var paymentMethodPlugins: [PXPaymentMethodPlugin] = [PXPaymentMethodPlugin]()

    // MARK: Init.
    /**
     Builder for `PXPaymentConfiguration` construction.
     - parameter paymentProcessor: Your custom implementation of `PXPaymentProcessor`.
     */
    public init(paymentProcessor: PXPaymentProcessor) {
        self.splitPaymentProcessor = PXPaymentProcessorAdapter(paymentProcessor: paymentProcessor)
    }

    public init(splitPaymentProcessor: PXSplitPaymentProcessor) {
        self.splitPaymentProcessor = splitPaymentProcessor
    }
}

// MARK: - Builder
extension PXPaymentConfiguration {
    /**
     Add your own payment method option to pay.
     - parameter plugin: Your custom payment method plugin.
     */
    @available(*, deprecated: 4.5.0, message: "Payment method plugins is no longer available.")
    /// :nodoc
    open func addPaymentMethodPlugin(plugin: PXPaymentMethodPlugin) -> PXPaymentConfiguration {
        return self
    }

    /**
     Add extra charges that will apply to total amount.
     - parameter charges: the list (array) of charges that could apply.
     */
    open func addChargeRules(charges: [PXPaymentTypeChargeRule]) -> PXPaymentConfiguration {
        self.chargeRules.append(contentsOf: charges)
        return self
    }

    /**
     `PXDiscountConfiguration` is an object that represents the discount to be applied or error information to present to the user. It's mandatory to handle your discounts by hand if you set a payment processor.
     - parameter config: Your custom discount configuration
     */
    @available(*, deprecated)
    open func setDiscountConfiguration(config: PXDiscountConfiguration) -> PXPaymentConfiguration {
        return self
    }
}

// MARK: - Internals
extension PXPaymentConfiguration {
    internal func getPaymentConfiguration() -> PXPaymentConfigurationType {
        return (chargeRules, splitPaymentProcessor)
    }
}
