//
//  PXPaymentMethodPlugin.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 12/14/17.
//  Copyright © 2017 MercadoPago. All rights reserved.
//

import Foundation

/**
 Use to create yout custom payment option. We´ll display this option in the payment method selection screen.
 */
@objcMembers
open class PXPaymentMethodPlugin: NSObject {
    /// :nodoc:
    @objc public enum DisplayOrder: Int {
        case TOP
        case BOTTOM
    }

    internal static let PAYMENT_METHOD_TYPE_ID = PXPaymentTypes.PAYMENT_METHOD_PLUGIN.rawValue
    internal var paymentMethodPluginId: String
    internal var name: String
    internal var paymentMethodPluginDescription: String?
    internal var image: UIImage
    internal var paymentMethodConfigPlugin: PXPaymentMethodConfigProtocol?
    internal var displayOrder = DisplayOrder.TOP

    // MARK: Init.
    /**
     Builder construction.
     - parameter paymentMethodPluginId: Id for your custom payment method.
     - parameter name: Name for your custom payment method.
     - parameter image: Image icon for your custom payment method.
     - parameter description: Description for your custom payment method.
     */
    public init (paymentMethodPluginId: String, name: String, image: UIImage, description: String?) {
        self.paymentMethodPluginId = paymentMethodPluginId
        self.name = name
        self.image = image
        self.paymentMethodPluginDescription = description
    }

    // MARK: Public accessors.
    /**
     Async block to initialize your payment method plugin.
     */
    open var initPaymentMethodPlugin: (PXCheckoutStore, @escaping (_ success: Bool) -> Void) -> Void = {store, callback in
        callback(true)
    }

    /**
     Determinate if your payment method plugin should be show.
     */
    open var mustShowPaymentMethodPlugin: (PXCheckoutStore) -> Bool = { shouldShowPlugin in return true }
}

// MARK: - Setters
extension PXPaymentMethodPlugin {
    /**
     Set config screen for payment method. Implementing `PXPaymentMethodConfigProtocol`
     - parameter config: PXPaymentMethodConfigProtocol implementation.
     */
    open func setPaymentMethodConfig(config: PXPaymentMethodConfigProtocol) {
        self.paymentMethodConfigPlugin = config
    }

    /**
     Set display order for your custom payment method. The values are `TOP` or `BOTTOM`.
     - parameter order: Display order value.
     */
    open func setDisplayOrder(order: DisplayOrder) {
        self.displayOrder = order
    }
}

/** :nodoc: */
extension PXPaymentMethodPlugin: PaymentMethodOption, PaymentOptionDrawable {
    func isDisabled() -> Bool {
        return false
    }

    func getPaymentType() -> String {
        return paymentMethodPluginId
    }

    public func getId() -> String {
        return paymentMethodPluginId
    }

    public func getDescription() -> String {
        return name
    }

    public func getComment() -> String {
        return ""
    }

    public func hasChildren() -> Bool {
        return false
    }

    func getChildren() -> [PaymentMethodOption]? {
        return nil
    }

    public func isCard() -> Bool {
        return false
    }

    public func isCustomerPaymentMethod() -> Bool {
        return false
    }

    public func getImage() -> UIImage? {
        return image
    }

    public func getTitle() -> String {
        return name
    }

    public func getSubtitle() -> String? {
        return nil
    }

    public func setDescription(_ text: String?) {
        self.paymentMethodPluginDescription = text
    }
}

extension PXPaymentMethodPlugin {
    internal func toPaymentMethod(financialInstitutions: [PXFinancialInstitution]? = nil) -> PXPaymentMethod {
        //all PXPaymentMethodPlugin will only have aggregator processing mode available
        let paymentMethod = PXPaymentMethod(additionalInfoNeeded: nil, id: self.getId(), name: self.getTitle(), paymentTypeId: PXPaymentMethodPlugin.PAYMENT_METHOD_TYPE_ID, status: nil, secureThumbnail: nil, thumbnail: nil, deferredCapture: nil, settings: [], minAllowedAmount: nil, maxAllowedAmount: nil, accreditationTime: nil, merchantAccountId: nil, financialInstitutions: financialInstitutions, description: self.paymentMethodPluginDescription, processingModes: PXServicesURLConfigs.MP_DEFAULT_PROCESSING_MODES)
        paymentMethod.setExternalPaymentMethodImage(externalImage: self.getImage())
        return paymentMethod
    }
}
