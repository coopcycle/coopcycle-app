//
//  PXGenericPayment.swift
//  MercadoPagoSDK
//
//  Created by Eden Torres on 26/06/2018.
//  Copyright © 2018 MercadoPago. All rights reserved.
//

import Foundation

/**
 Use this object to notify your own custom payment using `PXPaymentProcessor`.
 */
@objcMembers
open class PXGenericPayment: NSObject, PXBasePayment {

    public func getPaymentMethodId() -> String? {
        return paymentMethodId
    }

    public func getPaymentMethodTypeId() -> String? {
        return paymentMethodTypeId
    }

    public func getPaymentId() -> String? {
        return paymentId
    }
    public func getStatus() -> String {
        return status
    }

    public func getStatusDetail() -> String {
        return statusDetail
    }

    /// :nodoc:
    @objc public enum RemotePaymentStatus: Int {
        case APPROVED
        case REJECTED
    }

    // MARK: Public accessors.
    /**
     id related to your payment.
     */
    public let paymentId: String?

    /**
     Status of your payment.
     */
    public let status: String

    /**
     Status detail of your payment.
     */
    public let statusDetail: String

    /**
     Payment method type id.
     */
    public let paymentMethodId: String?

    /**
     Payment method type id.
     */
    public let paymentMethodTypeId: String?

    // MARK: Init.
    /**
     - parameter status: Status of payment.
     - parameter statusDetail: Status detail of payment.
     - parameter paymentId: Id of payment.
     */
    @available(*, deprecated: 4.7.0, message: "Use init with payment method id")
    public init(status: String, statusDetail: String, paymentId: String? = nil) {
        self.status = status
        self.statusDetail = statusDetail
        self.paymentId = paymentId
        self.paymentMethodId = nil
        self.paymentMethodTypeId = nil
    }

    /// :nodoc:
    public init(paymentStatus: PXGenericPayment.RemotePaymentStatus, statusDetail: String, receiptId: String? = nil) {
        var paymentStatusStrDefault = PXPaymentStatus.REJECTED.rawValue

        if paymentStatus == .APPROVED {
            paymentStatusStrDefault = PXPaymentStatus.APPROVED.rawValue
        }
        self.status = paymentStatusStrDefault
        self.statusDetail = statusDetail
        self.paymentId = receiptId
        self.paymentMethodId = nil
        self.paymentMethodTypeId = nil
    }

    // MARK: Init.
    /**
     - parameter status: Status of payment.
     - parameter statusDetail: Status detail of payment.
     - parameter paymentId: Id of payment.
     - parameter paymentMethodId: Payment Method id.
     - parameter paymentMethodTypeId: Payment Type Id.
     */
    public init(status: String, statusDetail: String, paymentId: String? = nil, paymentMethodId: String?, paymentMethodTypeId: String?) {
        self.status = status
        self.statusDetail = statusDetail
        self.paymentId = paymentId
        self.paymentMethodId = paymentMethodId
        self.paymentMethodTypeId = paymentMethodTypeId
    }
}
