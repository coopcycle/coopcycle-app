//
//  PXAdvancedConfiguration.swift
//  MercadoPagoSDK
//
//  Created by Juan sebastian Sanzone on 30/7/18.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 Advanced configuration provides you support for custom checkout functionality/configure special behaviour when checkout is running.
 */
@objcMembers
open class PXAdvancedConfiguration: NSObject {

    internal var productId: String?

    // MARK: Public accessors.
    /**
     Advanced UI color customization. Use this config to create your custom UI colors based on PXTheme protocol. Also you can use this protocol to customize your fonts.
     */
    open var theme: PXTheme?

    /**
     Add the possibility to configure ESC behaviour.
     If set as true, then saved cards will try to use ESC feature.
     If set as false, then security code will be always asked.
     */
    @available(*, deprecated)
    open var escEnabled: Bool = true

    /**
     Add the possibility to enabled/disabled express checkout.
     */
    open var expressEnabled: Bool = false

    /**
    Instores usage / money in usage. - Use case: Not all bank deals apply right now to all preferences.
     */
    open var bankDealsEnabled: Bool = true

    /**
     Loyalty usage. - Use case: Show/hide bottom amount row.
     */
    open var amountRowEnabled: Bool = true

    /**
     Enable to preset configurations to customize visualization on the 'Review and Confirm screen'
     */
    open var reviewConfirmConfiguration: PXReviewConfirmConfiguration = PXReviewConfirmConfiguration()

    /**
     Enable to preset configurations to customize visualization on the 'Congrats' screen / 'PaymentResult' screen.
     */
    open var paymentResultConfiguration: PXPaymentResultConfiguration = PXPaymentResultConfiguration()

     /**
     Add dynamic custom views on 'Review and Confirm screen'.
     */
    open var reviewConfirmDynamicViewsConfiguration: PXReviewConfirmDynamicViewsConfiguration?

     /**
     Add dynamic view controllers to flow.
     */
    open var dynamicViewControllersConfiguration: [PXDynamicViewControllerProtocol] = []

    /**
     Set additional data to get discounts
     */
    open var discountParamsConfiguration: PXDiscountParamsConfiguration? {
        didSet {
            productId = discountParamsConfiguration?.productId
        }
    }

    /**
     Set product id
     */
    open func setProductId(id: String) {
        self.productId = id
    }

    internal func isESCEnabled() -> Bool {
        return true
    }
}
